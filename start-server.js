/* @flow */
const child_process = require('child_process');

const args = [ 'start' ];
const opts = { stdio: 'inherit', cwd: 'server', shell: true };

child_process.spawn('npm', args, opts);
