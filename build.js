const { exec } = require('child_process');

const tailwind = exec('npx tailwindcss -i ./src/input.css -o ./dist/output.css --watch');

tailwind.stdout.on('data', (data) => {
  console.log(data);
});

tailwind.stderr.on('data', (data) => {
  console.error(data);
});

tailwind.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
