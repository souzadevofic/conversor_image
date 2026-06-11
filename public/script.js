let imagemConvertida = null;

const btnConverter =
    document.getElementById('btnConverter');

const btnBaixar =
    document.getElementById('btnBaixar');

btnConverter.addEventListener(
    'click',
    converter
);

btnBaixar.addEventListener(
    'click',
    baixar
);

async function converter() {

    const file =
        document.getElementById('image')
        .files[0];

    if (!file) {

        alert(
            'Selecione uma imagem.'
        );

        return;
    }

    const targetKB =
        document.getElementById('size')
        .value;

    const formData =
        new FormData();

    formData.append(
        'image',
        file
    );

    formData.append(
        'targetKB',
        targetKB
    );

    document.getElementById(
        'status'
    ).innerText =
        'Convertendo imagem...';

    try {

        const response =
            await fetch(
                '/converter',
                {
                    method:'POST',
                    body:formData
                }
            );

    const data = await response.json();

        imagemConvertida =
            data.image;

        document.getElementById(
            'status'
        ).innerText =
            `Imagem convertida para ${data.sizeKB} KB`;

        btnBaixar.disabled =
            false;

        const preview =
            document.getElementById(
                'preview'
            );

        preview.src =
            `data:image/jpeg;base64,${imagemConvertida}`;

        preview.style.display =
            'block';

    } catch {

        document.getElementById(
            'status'
        ).innerText =
            'Erro na conversão.';
    }
}

function baixar() {

    if (!imagemConvertida)
        return;

    const a =
        document.createElement('a');

    a.href =
        `data:image/jpeg;base64,${imagemConvertida}`;

    a.download =
        'imagem-convertida.jpg';

    document.body.appendChild(a);

    a.click();

    a.remove();
}