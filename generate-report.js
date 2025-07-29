const reporter = require('cucumber-html-reporter');

reporter.generate({
  theme: 'bootstrap',
  jsonFile: 'reports/cucumber_report.json',
  output: 'reports/cucumber-report.html',
  reportSuiteAsScenarios: true,
  scenarioTimestamp: true,
  launchReport: true,
  metadata: {
    'App Version': '1.0.0',
    'Test Environment': 'QA',
    'Browser': 'Chrome',
    'Platform': 'Windows 11',
    'Parallel': 'Scenarios',
    'Executed': 'Remote',
  }
});