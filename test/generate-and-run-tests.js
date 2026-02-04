const fs = require('fs');
const path = require('path');
const converter = require('openapi-to-postmanv2');
const newman = require('newman');

const swaggerFilePath = path.join(__dirname, '..', 'swagger.json');
const canonicalSchemaPath = path.join(__dirname, 'canonical_schema.json');
const collectionPath = path.join(__dirname, 'tests.collections.json');
const envPath = path.join(__dirname, 'tests.env.json');
const reportPath = path.join(__dirname, 'report.html');

// --- Main execution ---
async function runTestPipeline() {
  try {
    // Step 1: Generate swagger.json if not present
    if (!fs.existsSync(swaggerFilePath)) {
        throw new Error('swagger.json not found! Please run the application first to generate it.');
    }
    console.log('Found swagger.json.');

    // Step 2: Create canonical_schema.json from swagger.json
    const swaggerData = fs.readFileSync(swaggerFilePath, 'utf8');
    fs.writeFileSync(canonicalSchemaPath, swaggerData);
    console.log(`Step 1: Successfully created canonical_schema.json at ${canonicalSchemaPath}`);

    // Step 3: Convert canonical OpenAPI spec to Postman Collection
    const conversionResult = await convertSpecToPostman(canonicalSchemaPath);
    if (!conversionResult.status === 'passed') {
        throw new Error(`Failed to convert to Postman collection: ${conversionResult.reason}`);
    }
    let collection = conversionResult.collection;

    // --- NEW MODIFICATION: Hardcode baseUrl into collection structure ---
    const hardcodedBaseUrl = '127.0.0.1'; // IP address
    const hardcodedPort = '3000';

    function traverseAndModify(item) {
        if (item.request && item.request.url) {
            // Only modify if the host still contains the {{baseUrl}} variable or is undefined
            const urlHost = Array.isArray(item.request.url.host) ? item.request.url.host.join('.') : item.request.url.host;
            if (urlHost === '{{baseUrl}}' || !urlHost) {
                item.request.url.protocol = 'http';
                item.request.url.host = hardcodedBaseUrl.split('.'); // ['127', '0', '0', '1']
                item.request.url.port = hardcodedPort;
                // Ensure path starts with the API base path, not empty
                if (!item.request.url.path || item.request.url.path.length === 0) {
                    item.request.url.path = ['api']; // Default path segment
                } else if (item.request.url.path[0] !== 'api' && item.request.url.path[0] !== 'health') { // Ensure 'api' is the first segment if not already
                     item.request.url.path.unshift('api');
                }
                // Clear raw URL if it exists, let Newman reconstruct from structured fields
                delete item.request.url.raw;
            }
        }
        if (item.item) {
            item.item.forEach(traverseAndModify);
        }
    }
    collection.item.forEach(traverseAndModify);
    // --- END NEW MODIFICATION ---

    fs.writeFileSync(collectionPath, JSON.stringify(collection, null, 2));
    console.log(`Step 2: Successfully converted to Postman collection at ${collectionPath}`);

    // Step 4: Create tests.env.json (still needed for other potential variables, even if baseUrl is hardcoded)
    createPostmanEnvironment(envPath);
    console.log(`Step 3: Successfully created Postman environment file at ${envPath}`);

    // Step 5: Run Newman tests and generate report
    console.log('Step 4: Starting Newman test run...');
    await runNewman(collectionPath, envPath, reportPath);

    console.log('\n--- Test Pipeline Finished Successfully ---');
    console.log(`HTML report is available at: ${reportPath}`);

  } catch (error) {
    console.error('\n--- Test Pipeline Failed ---');
    console.error(error.message);
    process.exit(1);
  }
}

function convertSpecToPostman(specPath) {
  return new Promise((resolve, reject) => {
    converter.convert({ type: 'file', data: specPath }, {}, (err, result) => {
      if (err) {
        return reject(err);
      }
      if (!result.result) {
        return resolve({ status: 'failed', reason: result.reason });
      }
      resolve({ status: 'passed', collection: result.output[0].data });
    });
  });
}

function createPostmanEnvironment(filePath) {
    const environment = {
        name: "AUT Test Environment",
        values: [
            {
                key: "baseUrl",
                value: "http://127.0.0.1:3000",
                type: "default",
                enabled: true
            }
        ],
        _postman_variable_scope: "environment"
    };
    fs.writeFileSync(filePath, JSON.stringify(environment, null, 2));
}

function runNewman(collection, environment, report) {
  return new Promise((resolve, reject) => {
    newman.run({
      collection: require(collection),
      // We are hardcoding baseUrl, so environment is less critical for it, but might be for other vars
      environment: require(environment), 
      reporters: ['cli', 'html'],
      reporter: {
        html: {
          export: report,
          // template: './node_modules/newman-reporter-html/template.hbs' // Optional: for custom templates
        }
      }
    }, function (err, summary) {
      if (err || summary.error) {
        reject(err || new Error('Newman collection run failed.'));
      } else if (summary.run.failures.length > 0) {
        console.error(`${summary.run.failures.length} test assertion(s) failed.`);
        resolve(summary); 
      }
      else {
        console.log('All tests passed!');
        resolve(summary);
      }
    });
  });
}

// Execute the pipeline
runTestPipeline();