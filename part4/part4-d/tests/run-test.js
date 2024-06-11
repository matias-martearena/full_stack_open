// Run: node tests/run-test.js
import { spawn } from 'child_process'

const testFiles = [
  'tests/06-user_api.test.js',
  'tests/07-blog_api.test.js'
];

(async () => {
  for (const file of testFiles) {
    console.log(`Running ${file}...`)
    await new Promise((resolve, reject) => {
      const testProcess = spawn('node', ['--test', file], { stdio: 'inherit' })

      testProcess.on('close', (code) => {
        if (code !== 0) {
          return reject(new Error(`Test failed with code ${code}`))
        }
        resolve()
      })
    })
  }
})()
