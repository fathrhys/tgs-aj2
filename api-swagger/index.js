const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const fs = require('fs');
const yaml = require('js-yaml');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Load YAML file
const swaggerDocument = yaml.load(fs.readFileSync('./openapi.yml', 'utf8'));

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Data dummy
let siswa = [
  { id: 1, nama: 'Budi', jurusan: 'TJKT' },
  { id: 2, nama: 'Ani', jurusan: 'PPLG' }
];

// Endpoints
app.get('/halo', (req, res) => {
  res.json({ pesan: 'Halo dari API Sekolah!' });
});

app.get('/siswa', (req, res) => {
  res.json(siswa);
});

app.post('/siswa', (req, res) => {
  const data = req.body;
  const idBaru = siswa.length ? siswa[siswa.length - 1].id + 1 : 1;
  const siswaBaru = { id: idBaru, ...data };
  siswa.push(siswaBaru);
  res.status(201).json(siswaBaru);
});

app.get('/siswa/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const data = siswa.find(s => s.id === id);
  if (!data) return res.status(404).json({ pesan: 'Siswa tidak ditemukan' });
  res.json(data);
});

app.put('/siswa/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = siswa.findIndex(s => s.id === id);
  if (index === -1) return res.status(404).json({ pesan: 'Siswa tidak ditemukan' });

  siswa[index] = { id, ...req.body };
  res.json({ pesan: 'Data diperbarui' });
});

app.delete('/siswa/:id', (req, res) => {
  const id = parseInt(req.params.id);
  siswa = siswa.filter(s => s.id !== id);
  res.status(204).send();
});

// Run server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
