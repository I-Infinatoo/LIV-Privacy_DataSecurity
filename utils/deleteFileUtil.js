const path = require('path');
const fs = require('fs');

// function checkAndDeleteFile(filePath) {
//     fs.access(filePath, fs.constants.F_OK, (err) => {
//         if (err) {
//           console.error("File does not exist: " + filePath);
//         } else {
//             fs.unlink(filePath, (err) => {
//                 if (err) {
//                 console.error("Error deleting file: " + err);
//                 } else {
//                 console.log("File deleted: " + filePath);
//                 }
//             });
//         }
//     });
// }
function checkAndDeleteFile(filePath, retries = 0, maxRetries = 5, delay = 1000) {
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        // console.error("File does not exist: " + filePath);
        // console.error("Internal error. Please try again.");
      } else {
        fs.unlink(filePath, (err) => {
          if (err) {
            if (err.code === "EBUSY" && retries < maxRetries) {
              // console.warn("File is busy, retrying in " + delay + " ms...");
              setTimeout(() => {
                checkAndDeleteFile(filePath, retries + 1, maxRetries, delay);
              }, delay);
            } else {
              // console.error("Error deleting file: " + err);
            }
          } else {
            // console.log("File deleted: " + filePath);
          }
        });
      }
    });
  }

module.exports = {
    checkAndDeleteFile
}