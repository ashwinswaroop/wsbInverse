https://whispering-bastion-89983.herokuapp.com

The backend consists of a hadoop/spark cluster processing big data from multiple websites and their comment/post APIs. The spark jobs use this data and apply word frqeuency checks on top of them to generate a second layer of data. Finally, this data is combined with market data and uploaded to a transactional DB which is used to serve this website.
