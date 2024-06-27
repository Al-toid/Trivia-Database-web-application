
const fs = require("fs");

function writeUserDB(score){

    const dataScore = JSON.stringify(score , null, 2);
    fs.writeFileSync("scoreDB.json" , dataScore, "utf-8"); 

    /*try {
        fs.writeFileSync(filePath, dataScore, "utf-8");
        console.log("Score data written successfully to scoreDB.json");
      } catch (error) {
        console.error("Error writing to scoreDB.json:", error);
      }
        */

}

module.exports = {
    writeUserDB
}