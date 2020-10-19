const ftp = require("ftp");

const config = {
  host: process.env.FTPHOST,
  port: process.env.FTPPORT,
  user: process.env.FTPUSER,
  password: process.env.FTPPASS,
};

const client = new ftp();

client.on("ready", () => {
  console.log("connection success");
});
client.on("error", (err) => {
  console.log("FTP failed", err);
});

client.connect(config);

module.exports = client;

// EXAMPLES //

// client.put('./loc/l.jpg', './temp/l-copy.jpg', (err) => {
//   if(err){
//     console.log('upload failed', err);
//     return;
//   }

//   console.log('upload success');
// });

// client.list('./temp', (err, list) => {

//   if(err){
//     console.log('error in finding list', err);
//     return;
//   }

//   for(let item of list){
//     console.log(item.name);
//   }

// });
