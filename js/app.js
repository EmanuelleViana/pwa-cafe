/*

Variáveis Globais

*/
let web_service = "coffee.json";
let data_json;
let main_cafes = document.getElementById("main_cafes");
let cafes = document.getElementById("cafes");
let cafes_content = document.getElementById("cafes_content");
let btnVoltar = document.getElementById("btnVoltar");
let title_cafe = document.getElementById("title_cafe");
let btInstall = document.getElementById("btInstall");
let celular_compra = "31997222874";
let nome_cafe;
/*

Funções Principais

*/

//Trazer dado do servidor
function loadData() {

    let ajax = new XMLHttpRequest();

    ajax.open("GET", web_service, true);
    ajax.send();

    ajax.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            data_json = JSON.parse(this.responseText);
            //console.log(data_json);
            printCafes();
            cacheDinamico();
        }

    }

}

loadData();

//Montar o card de cafes
function printCafes() {

    let html_cafes = '<div class="row">';

    if (data_json.length > 0) {

        for (let i = 0; i < data_json.length; i++) {
            html_cafes += card_cafes(i, data_json[i].title, data_json[i].address, data_json[i].image, data_json[i].site);
        }

    } else {
        html_cafes = msg_alert("Não há cafés cadastrados", "warning");
    }

    html_cafes += '</div>';

    main_cafes.innerHTML = html_cafes;

}

function printCafe(id, title) {
    console.log('print ', id, title)
    window.scrollTo(0, 0);
    nome_cafe = title;
    title_cafe.innerHTML = title;
    main_cafes.style.display = "none";
    cafes.style.display = "block";

    let html_cafes = '<div class="info-cafe">';
    if (data_json[id].ingredients.length > 0) {

        html_cafes += card_composicao_cafe(data_json[id].title,data_json[id].ingredients, data_json[id].image_ingredients, data_json[id].info, data_json[id].sale);


    } else {
        html_cafes = msg_alert("Não há ingredientes cadastrados para este cafe", "warning");
    }

    cafes_content.innerHTML = html_cafes;
}

card_composicao_cafe = function (coffee, ingredients, image_ingredients, informacoes, emVenda) {
    console.log(ingredients)
    let ingredientes = '';
    for (let i = 0; i < ingredients.length; i++) {
        ingredientes += `<p>${ingredients[i]}</p>`
    }
    console.log(ingredientes)

    return `<div class="col col-lg-12">            
                <div class="card h-100">
                    <div class="card-body">
                        <h3 class="card-title mb-5 text-center">Ingredientes</h3>   `
                    + '<div class="ingredientes text-center">' +
                        ingredientes 
                    + "</div>" +
                    `<span class="container_cafe"><img src="${image_ingredients}" class="image_cafe"></span>
                    </div>
                    <div class="card-footer">
                    <div class="btn-group w-100" role="group" aria-label="Ações">
                    <a href="#" class="btn btn-conhecer-mais w-50" data-bs-toggle="modal" data-bs-target="#modalCafe" onClick="javascript:changeModal('${coffee}', '${informacoes}','${emVenda}')">Conhecer Mais</a>
                    <a href="#" onClick="javascript:formataMensagem('${coffee}')" class="btn btn-success w-50 btn-whatsapp">Encomendar</a>
                    </div>
                </div>
                </div>
            </div>`;

}

function changeModal(name, info, disponivel) {

    document.getElementById("nome_cafe").innerHTML = name;
    document.getElementById("desc_cafe").innerHTML = "<strong>Descrição:</strong>&nbsp;" + info;
    document.getElementById("venda_cafe").innerHTML = "<strong>Em venda:</strong>&nbsp;" + disponivel;

}

function voltarTela() {
    main_cafes.style.display = "block";
    cafes.style.display = "none";
}

const CACHE_DINAMICO = "cafearoma_dinamico";

let cacheDinamico = function () {

    if ('caches' in window) {

        let ARQUIVOS_DINAMICOS = [web_service];

        caches.delete(CACHE_DINAMICO).then(function () {

            if (data_json.length > 0) {

                for (let i = 0; i < data_json.length; i++) {

                    if (ARQUIVOS_DINAMICOS.indexOf(data_json[i].image) == -1) {
                        ARQUIVOS_DINAMICOS.push(data_json[i].image);
                    }

                    if (ARQUIVOS_DINAMICOS.indexOf(data_json[i].image_ingredients) == -1) {
                        ARQUIVOS_DINAMICOS.push(data_json[i].image_ingredients);
                    }
                }

                caches.open(CACHE_DINAMICO).then(function (cache) {

                    cache.addAll(ARQUIVOS_DINAMICOS).then(function () {

                        console.log("Cache dinâmico realizado com sucesso!");

                    });

                });

            }

        })

    }

}

/*

Botão de Instalação

*/

let janelaInstalacao = null;

window.addEventListener('beforeinstallprompt', gravarJanela);

function gravarJanela(evt) {
    console.log('janelaInstalacao1 instalacao', janelaInstalacao)

    janelaInstalacao = evt;
}

let inicializarInstalacao = function () {
    console.log('Inicializar instalacao')
    setTimeout(function () {
        console.log('janelaInstalacao instalacao', janelaInstalacao)

        if (janelaInstalacao != null) {
            btInstall.removeAttribute("hidden");
        }

    }, 500);

    btInstall.addEventListener("click", function () {

        btInstall.setAttribute("hidden", true);
        btInstall.hidden = true;

        janelaInstalacao.prompt();

        janelaInstalacao.userChoice.then((choice) => {

            if (choice.outcome === "accepted") {

                console.log("Usuário instalou o app!");

            } else {
                console.log("Usuário NÃO instalou o app!");
                btInstall.hidden = false;
                btInstall.removeAttribute("hidden");
            }

        });

    });

}

/*

Primitive Template Engines

*/

msg_alert = function (texto, style) {
    return '<div class="alert alert-' + style + '" role="alert">' + texto + '</div>';
}

card_cafes = function (id, title, descricao, imagem, site) {
    return `<div class="col-12 col-lg-6 coffee">            
                <div class="card" onclick="javascript:printCafe(${id},'${title}')">
                    <div class="card-body">
                        <div class="row">
                            <div>
                                <div class="d-flex align-items-center justify-content-center" style="height: 100%;">
                                <img src="${imagem}" class="logo_cafe">
                                </div>                      
                            </div>
                            </div>
                            <div class="row">

                            <div >   
                                <h5 class="text-center mt-4	card-title">${title}</h5>                                            
                            </div>
                        </div>              
                    </div>
                </div>
            </div> `;
}


/*

Funções Extras

*/

function formataMensagem(cafe) {

    var mensagem = "Olá *Cafe&Aroma*, gostaria de informações para compra do café especial *" + cafe + "*.\n\nPoderia por favor me retornar.\n\nObrigado(a)";

    enviarWhatsApp(mensagem, celular_compra);

}


function enviarWhatsApp(mensagem, celular) {

    if (celular.length < 13) {
        celular = "55" + celular;
    }

    var texto = mensagem;
    texto = window.encodeURIComponent(texto);

    let urlApi = "https://api.whatsapp.com/send";

    window.open(urlApi + "?phone=" + celular + "&text=" + texto, "_self");
}
