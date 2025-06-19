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

// Functie aanroepen met parameters
//const host = 'sftp.loyaltyprofs.nl';
//const port = 2222;
//const username = 'beesda2_volvo';
//const password = '9Hm5Rzm7oC6GZak5n63$q';

//downloadLaatsteBestand(req, res);

module.exports = {
  downloadLaatsteBestandLoyaltyProfs : downloadLaatsteBestandLoyaltyProfs
  
  };