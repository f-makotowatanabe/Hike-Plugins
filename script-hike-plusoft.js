// ==UserScript==
// @name         HIKE - Página Chamado
// @description  Melhorias na interface do HIKE
// @version      2025.09.12
// @author       MakotoWatanabe
// @include      https://plusoft-itsm.inpaas.com/forms-v2/bpmruntime.userflows.forms.bpm_workflow_*
// @icon         https://hikeplatform.com/wp-content/themes/area-structure-1/assets/images/favicon.png
// @downloadURL  https://raw.githubusercontent.com/f-makotowatanabe/Hike-Plugins/refs/heads/main/script-hike-plusoft.js
// @updateURL    https://raw.githubusercontent.com/f-makotowatanabe/Hike-Plugins/refs/heads/main/script-hike-plusoft.js
// @grant        none
// @run-at       document-idle
// ==/UserScript==


(function() {
    'use strict';
    const $ = window.jQuery; // Assign jQuery to the $ variable


    /* FUNCAO DE VERIFICAR O CHAMADO
    // ------------------------------------------------- */
    function verificaChamado() {

        /* Busca as informações no chamado
        // -------------------------------------------- */
        const inputPrefixo = document.querySelector('[ng-model="vm.entity.data.prefix_alias"]')?.value || '';
        const inputTitulo = document.getElementById('field-title')?.value || '';
        const inputStatus = document.querySelector('[ng-model="vm.entity.data._bpm_step_title"]');
        const inputData = document.getElementById('field-duedate');
        const inputHoraAlocadaCria = document.getElementById("field-field_currency_28ef7c");
        const inputHoraAlocadaCamp = document.getElementById("field-field_currency_5e8d28");





        /* Local onde renderiza os alerts
        // -------------------------------------------- */
        const RenderizaHeader = document.querySelector('.page-actions.pull-right');
        const RenderizaFlutuante = document.querySelector('.page-text-header');




        /* Adiciona os botões âncora
        // -------------------------------------------- */
        const observer = new MutationObserver(() => {
            const botaoComent = document.querySelector('button[uib-tooltip="Comentários"]');
            if (botaoComent) {
                botaoComent.click();
                console.log("Botão 'Comentários' clicado via observer.");
                observer.disconnect();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });

        const botaoAncora = '<div class="JSbotaoAncora"><a href="#mainForm" onclick="clicaComent();"><i class="fa fa-chevron-circle-up"></i></a><a href="#editor"><i class="fa fa-comment"></i></a></div>';
        RenderizaFlutuante.insertAdjacentHTML("afterbegin", botaoAncora);





        /* Adiciona o titulo do chamado no topo
        // -------------------------------------------- */
        const tituloDoChamado = '<div id="JStituloDoChamado">['+inputPrefixo+'] '+inputTitulo+'</div>';
        RenderizaHeader.insertAdjacentHTML("afterend", tituloDoChamado);



        /* Converte data no formato ISO
        // -------------------------------------------- */
        function converteParaIso(dataBrComHora) {
            const dataBr = dataBrComHora.split(' ')[0];
            const [dia, mes, ano] = dataBr.split('/');
            return `${ano}-${mes}-${dia}`;
        }



        /* Verifica data do chamado versu data atual
        // -------------------------------------------- */
        function verificaInputData() {
            /* Formata data em string
            // -------------------------------------------- */
            const hoje = new Date();
            const hoje_formatado = hoje.toLocaleDateString('pt-BR');
            const dataHoje = converteParaIso(hoje_formatado);
            const dataChamado = converteParaIso(inputData.value);

            /* se existir input status no chamado
            // -------------------------------------------- */
            if (inputStatus) {
                /* Se o status for diferente de concluido ou cancelado
                // -------------------------------------------- */
                 if (inputStatus.value != "Concluído" && inputStatus.value != "Cancelado") {
                     if (dataChamado == dataHoje) {
                         const novoElemento = '<div class="JSverificaStatus"><span class="label-status" title="'+inputStatus.value+'">'+inputStatus.value+'</span> <span class="label-status" title="amarelo">'+inputData.value+'</span></div>';
                         RenderizaFlutuante.insertAdjacentHTML("beforeend", novoElemento);

                     } else if (dataChamado < dataHoje) {
                         const novoElemento = '<div class="JSverificaStatus"><span class="label-status" title="'+inputStatus.value+'">'+inputStatus.value+'</span> <span class="label-status" title="vermelho">'+inputData.value+'</span></div>';
                         RenderizaFlutuante.insertAdjacentHTML("beforeend", novoElemento);

                     } else {
                         const novoElemento = '<div class="JSverificaStatus"><span class="label-status" title="'+inputStatus.value+'">'+inputStatus.value+'</span> <span class="label-status" title="verde">'+inputData.value+'</span></div>';
                         RenderizaFlutuante.insertAdjacentHTML("beforeend", novoElemento);
                     }
                 }
                else {
                    const novoElemento = '<div class="JSverificaStatus"><span class="label-status" title="'+inputStatus.value+'">'+inputStatus.value+'</span></div>';
                    RenderizaFlutuante.insertAdjacentHTML("beforeend", novoElemento);
                }
            };

        }



        /* Arruma o bootstrap
        // -------------------------------------------- */
        function ArrumaBootstrap() {
            // achar uma forma de fazer if else para entender onde o control label está
            // esse script funciona para os formularios, porem quebra o checkbox
            // SE control-label é uma questão, usar tamanho col-sm-2.
            // SE control-label é um checkbox, usar tamanho col-sm-10.

            //const divs1 = document.querySelectorAll('.col-xs-12.col-sm-4.control-label');
            //divs1.forEach(element => {
            //    element.classList.remove('col-sm-4');
            //    element.classList.add('col-sm-2');
            //});

            const divs2 = document.querySelectorAll('.col-xs-12.col-sm-5');
            divs2.forEach(element => {
                element.classList.remove('col-sm-5');
                element.classList.add('col-sm-8');
            });
        }
        ArrumaBootstrap();




        /* Verifica se o campo hora no chamado está preenchido
        // -------------------------------------------- */
        let HoraAlocada = '';
        function verificaHoraAlocada() {
            /* SE hora alocada for vazio
            // -------------------------------------------- */
            if (HoraAlocada === '') {
                const popVerificaHoras = '<div class="JSverificaHora" role="alert">O campo <strong>Horas alocadas</strong> está vazio!</div>';
                RenderizaFlutuante.insertAdjacentHTML("afterend", popVerificaHoras);
            }
        }

        /* Verifica tipo do chamado
        // -------------------------------------------- */
        function qualChamado(){
            if (inputPrefixo.includes("CRI-")) {
                /* Define hora alocada
                // -------------------------------------------- */
                if (inputHoraAlocadaCria) {
                    HoraAlocada = inputHoraAlocadaCria?.value;
                }
                verificaHoraAlocada();

                /* Arruma collapse
                // -------------------------------------------- */
                const ArrumaItensRelacionados = document.querySelector('a[data-target="#collapse-section1743106615271"]').setAttribute('data-target', '#collapse-section-1743106615271');
                const ArrumaItensVinculados = document.querySelector('a[data-target="#collapse-section1743106628590"]').setAttribute('data-target', '#collapse-section-1743106628590');

                /* Fecha collapse
                // -------------------------------------------- */
                const ItensVinculado = document.querySelectorAll('a[data-target="#collapse-section-1743106628590"]');
                for (let cri = 0; cri < ItensVinculado.length; cri++) {
                    ItensVinculado[cri].click();
                }
            }
            else if (inputPrefixo.includes("CAMP-")) {
                /* Define hora alocada
                // -------------------------------------------- */
                if (inputHoraAlocadaCamp) {
                    HoraAlocada = inputHoraAlocadaCamp?.value;
                }
                verificaHoraAlocada();

                /* Arruma collapse
                // -------------------------------------------- */
                const ArrumaItensRelacionados = document.querySelector('a[data-target="#collapse-section1741204439162"]').setAttribute('data-target', '#collapse-section-1741204439162');
                const ArrumaItensVinculados = document.querySelector('a[data-target="#collapse-section1743761535133"]').setAttribute('data-target', '#collapse-section-1743761535133');
            }
            else if (inputPrefixo.includes("CRIATASK-")) {
                const inputPrefixoPai = document.querySelector('[ng-model="vm.entity.data.bpm_exec.bpm_exec_parent.prefix_alias"]');

                if (inputPrefixoPai.value !== '') {
                    const botaoLink = '<span class="input-group-btn"><a type="button" class="btn btn-primary btn-sm" href="https://plusoft-itsm.inpaas.com/api/browse/'+inputPrefixoPai.value+'" target="_blank">Abrir chamado pai</a></span>';
                    inputPrefixoPai.insertAdjacentHTML("afterend", botaoLink);
                }
                else {
                    const botaoLink = '<div class="input-group-addon ChamadoPaiNaoRelacionado">Chamado pai não relacionado</div>'
                    inputPrefixoPai.insertAdjacentHTML("beforebegin", botaoLink);
                }
            }

        }
        qualChamado();
        verificaInputData();



    } setTimeout(verificaChamado, 5000);


    /*  SCROLL SUAVE
    // ------------------------------------------------- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

})
();
