const express = require('express');
const multer = require('multer');
const sharp = require('sharp');

const app = express();
const PORT = 3000;

app.use(express.static('public'));

const upload = multer({
    storage: multer.memoryStorage()
});

// async function compressImage(buffer, targetKB) {

//     let quality = 100;
//     let outputBuffer;

//     while (quality >= 5) {

//         outputBuffer = await sharp(buffer)
//             .jpeg({ quality })
//             .toBuffer();

//         const sizeKB = outputBuffer.length / 1024;

//         if (sizeKB <= targetKB) {
//             return outputBuffer;
//         }

//         quality -= 5;
//     }

//     return outputBuffer;
// }

async function compressImage(buffer, targetKB) {

    const targetBytes = targetKB * 1024;

    let metadata =
        await sharp(buffer).metadata();

    let width = metadata.width;

    let outputBuffer = buffer;

    while (width > 100) {

        let quality = 90;

        while (quality >= 5) {

            outputBuffer = await sharp(buffer)
                .resize({
                    width: Math.round(width)
                })
                .jpeg({
                    quality
                })
                .toBuffer();

            if (
                outputBuffer.length <= targetBytes
            ) {
                return outputBuffer;
            }

            quality -= 5;
        }

        width *= 0.9;
    }

    return outputBuffer;
}


app.post(
    '/converter',
    upload.single('image'),
    async (req, res) => {

        try {

            const targetKB =
                parseInt(req.body.targetKB);

            const compressedImage =
                await compressImage(
                    req.file.buffer,
                    targetKB
                );

            res.set({
                'Content-Type': 'image/jpeg'
            });

            // res.send(compressedImage);

        res.json({
            image: compressedImage.toString('base64'),
            sizeKB: (
                compressedImage.length / 1024
            ).toFixed(2)
        });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                erro: 'Erro ao converter imagem'
            });
        }
    }
);

app.listen(PORT, () => {
    console.log(
        `Servidor rodando em http://localhost:${PORT}`
    );
});