const fs = require('fs');
const path = require('path');
const newman = require('newman');

const generatedTestsPath = path.join(__dirname, 'generated_tests.json'); // Path to the generated tests
const envPath = path.join(__dirname, 'tests.env.json');
const reportPath = path.join(__dirname, 'report.html');

// Deployed application URL
const deployedBaseUrl = "https://aut-notes-tasks-manager-api.onrender.com";

// --- Main execution ---
async function runTestPipeline() {
  try {
    // Step 1: Ensure generated_tests.json exists
    if (!fs.existsSync(generatedTestsPath)) {
        throw new Error(`generated_tests.json not found! Please run 'python3 generate_tests.py' first.`);
    }
    console.log('Found generated_tests.json.');

    // Step 2: Load the generated test cases as the Newman collection
    const collection = require(generatedTestsPath);
    console.log(`Step 1: Successfully loaded test cases from ${generatedTestsPath}`);

    // Step 3: Create tests.env.json with the deployed URL
    createPostmanEnvironment(envPath, deployedBaseUrl);
    console.log(`Step 2: Successfully created Postman environment file at ${envPath} with base URL ${deployedBaseUrl}`);

    // Step 4: Run Newman tests and generate report
    console.log('Step 3: Starting Newman test run against deployed application...');
    await runNewman(collection, envPath, reportPath);

    console.log('\n--- Test Pipeline Finished Successfully ---');
    console.log(`HTML report is available at: ${reportPath}`);

  } catch (error) {
    console.error('\n--- Test Pipeline Failed ---');
    console.error(error.message);
    process.exit(1);
  }
}

function createPostmanEnvironment(filePath, baseUrl) {
    const environment = {
        name: "AUT Deployed Environment",
        values: [
            {
                key: "baseUrl",
                value: baseUrl,
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
      collection: collection, // Use the loaded collection object
      environment: require(environment), // Load the environment object
      globalVar: [
        { key: 'DISABLE_RATE_LIMIT', value: 'true' } // Global variable to disable rate limit on the server
      ],
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
        // We resolve here instead of reject because the run itself completed.
        // The HTML report will show the failures.
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
