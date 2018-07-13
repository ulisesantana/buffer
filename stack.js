
const ip = require('ip');
const executor = require('child_process').exec;
const dockerComposeCommand = `docker-compose up -d`;
const dockerBuildCommand = `docker-compose build && docker-compose up -d`;
const exec = (command) => {
  return new Promise((resolve, reject) => {
    executor(command, (err, stdout, stderr) => {
      if (err) {
        return reject(err);
      }

      return resolve(stdout, stderr)
    });
  });
};

function logCommand(stdout, stderr){
  console.log(`STDOUT: ${stdout}`);
  console.error(`STDERR: ${stderr}`);
}
const { argv: [p, s, ...args] } = process;

process.env.HOST_IP = ip.address();
exec(args.includes('up') ? dockerComposeCommand : dockerBuildCommand)
  .then(logCommand)
  .catch((err) => console.error(err.toString()));
