const Client = require('ssh2-sftp-client');
const sftp = new Client();

async function downloadLaatsteBestandLoyaltyProfs(req, res) {
  try {
    // Configuratie op basis van de parameters
	
	let host = req.query.host;
	let port = req.query.port;
	let username = req.query.username;
	let password = req.query.password;
	
	
    const config = {
      host: host,
      port: port || 22, // Standaardpoort 22 als geen andere opgegeven
      username: username,
      password: password,
    };

    await sftp.connect(config);
    console.log('Verbonden met SFTP server');

    const remoteMap = '/files/todo/';
    const bestanden = await sftp.list(remoteMap);

    if (bestanden.length === 0) {
      console.log('Geen bestanden gevonden in de map.');
      return;
    }

    const laatsteBestand = bestanden.reduce((latest, current) =>
      current.modifyTime > latest.modifyTime ? current : latest
    );

    console.log('Laatste bestand:', laatsteBestand.name);

    const remotePad = remoteMap + laatsteBestand.name;
    const lokaalPad = '/volvo/LoyaltyProfs.csv';

    await sftp.get(remotePad, lokaalPad);
    console.log('Download succesvol');

    await sftp.end();
  } catch (err) {
    console.error('Fout tijdens SFTP-download:', err);
  }
}

async function uploadTSVBestandLoyaltyProfs(req, res) {
  try {
    // Configuratie op basis van de parameters
	
	let host = req.query.host;
	let port = req.query.port;
	let username = req.query.username;
	let password = req.query.password;
	 
	let sftpFileName = req.query.sftpFileName;
	
	
	const remoteMap = '/files/lptodo/' + sftpFileName ;
	console.log('remoteMap: ' + remoteMap);
	
    const lokaalPad = '/volvo/' + sftpFileName;
	console.log('lokaalPad: ' + lokaalPad);
	
    const config = {
      host: host,
      port: port || 22, // Standaardpoort 22 als geen andere opgegeven
      username: username,
      password: password,
    };

    await sftp.connect(config);
    console.log('Verbonden met SFTP server');

    

    await sftp.put(lokaalPad, remoteMap);
    console.log('Upload succesvol');

    await sftp.end();
  } catch (err) {
    console.error('Fout tijdens SFTP-upload:', err);
  }
}



module.exports = {
  downloadLaatsteBestandLoyaltyProfs : downloadLaatsteBestandLoyaltyProfs,
  uploadTSVBestandLoyaltyProfs: uploadTSVBestandLoyaltyProfs,
  
  };