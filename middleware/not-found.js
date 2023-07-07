const notFound = (req, res) => res.status(404).send('Il percorso non esiste')

module.exports = notFound
