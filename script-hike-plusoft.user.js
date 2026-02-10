// ==UserScript==
// @name         HIKE
// @description  Melhorias na interface do HIKE
// @version      2026.02.10
// @author       MakotoWatanabe
// @icon         https://hikeplatform.com/wp-content/themes/area-structure-1/assets/images/favicon.png
// @match        https://plusoft-itsm.inpaas.com/forms-v2/*
// @downloadURL  https://raw.githubusercontent.com/f-makotowatanabe/Hike-Plugins/refs/heads/main/script-hike-plusoft.user.js
// @updateURL    https://raw.githubusercontent.com/f-makotowatanabe/Hike-Plugins/refs/heads/main/script-hike-plusoft.user.js
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';
    const $ = window.jQuery;
    const url = window.location.href;

    /* WORKFLOW
    ========================= */
    function PaginaWorkflow() {

        /* Arruma o tamanho das colunas do bootstrap
        // -------------------------------------------- */

        // colunas dos Campos de busca e filtro
        const Campobusca = document.querySelector('.finder-desk');
        if (Campobusca) {
            const altera1 = Campobusca.querySelectorAll('.row:nth-child(1)>div:nth-child(1)');
            altera1.forEach(element => {
                element.classList.remove('col-sm-6');
                element.classList.remove('col-md-4');
                element.classList.add('col-sm-2');
            });
            const altera2 = Campobusca.querySelectorAll('.row:nth-child(1)>div:nth-child(2)');
            altera2.forEach(element => {
                element.classList.remove('col-sm-6');
                element.classList.remove('col-md-4');
                element.classList.add('col-sm-6');
            });
            const altera3 = Campobusca.querySelectorAll('.row:nth-child(1)>div:nth-child(3)');
            altera3.forEach(element => {
                element.classList.remove('col-sm-6');
                element.classList.remove('col-md-4');
                element.classList.add('col-sm-4');
            });

            const altera4 = Campobusca.querySelectorAll('.row:nth-child(2)>div:nth-child(1)');
            altera4.forEach(element => {
                element.classList.remove('col-sm-4');
                element.classList.add('col-sm-12');
                element.style.removeProperty("margin");
            });

            const filtroIcone = Campobusca.querySelectorAll('.mar-btm');
            filtroIcone.forEach(element => {
                element.classList.remove('mar-btm');
            });

        }

        // Botão verde de novo chamado
        const botaoNovoChamado = document.querySelectorAll('.page-actions.pull-right.pad-rgt');
        botaoNovoChamado.forEach(element => {
            element.classList.remove('pull-right');
            element.classList.remove('pad-rgt');
        });

    }

    /* CHAMADO
    ========================= */
    function PaginaChamado() {

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

        const botaoAncora = '<div class="JSbotaoAncora"><a href="#mainForm"><i class="fa fa-chevron-circle-up"></i></a><a href="#editor-comentario"><i class="fa fa-comment"></i></a></div>';
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



        /* Arruma o tamanho das colunas do bootstrap
        // -------------------------------------------- */
        function ArrumaBootstrap1(callback) {

            const arruma1 = document.querySelectorAll('.form-group>label:nth-child(1)');
            arruma1.forEach(element => {
                element.classList.remove('col-xs-12');
                element.classList.remove('col-sm-4');
                element.classList.add('col-sm-2');
            });
            const arruma2 = document.querySelectorAll('.form-group>div.col-xs-12.col-sm-5');
            arruma2.forEach(element => {
                element.classList.remove('col-xs-12');
                element.classList.remove('col-sm-5');
                element.classList.add('col-sm-10');
            });
            const arruma3 = document.querySelectorAll('.form-group>div.col-xs-12.col-sm-8');
            arruma3.forEach(element => {
                element.classList.remove('col-xs-12');
                element.classList.remove('col-sm-8');
                element.classList.add('col-sm-10');
            });

            const ColunaSizeHistory = document.querySelectorAll('.col-md-11.hidden-xs');
            ColunaSizeHistory.forEach(element => {
                element.classList.remove('col-md-11');
                element.classList.add('col-sm-12');
            });

            callback();
        }
        function ArrumaBootstrap2() {
            const altera1 = document.querySelectorAll('.field-checkbox>label');
            altera1.forEach(element => {
                element.classList.remove('col-sm-2');
                element.classList.remove('col-sm-4');
                element.classList.add('col-sm-8');
            });
            const altera2 = document.querySelectorAll('.field-checkbox>div.col-sm-10');
            altera2.forEach(element => {
                element.classList.remove('col-sm-10');
                element.classList.add('col-sm-4');
            });
            const altera3 = document.querySelectorAll('.col-xs-12.col-sm-6>.field-string>label');
            altera3.forEach(element => {
                element.classList.remove('col-sm-2');
                element.classList.remove('col-sm-4');
                element.classList.add('col-sm-8');
            });
            const altera4 = document.querySelectorAll('.col-xs-12.col-sm-6>.field-string>div.col-sm-10');
            altera4.forEach(element => {
                element.classList.remove('col-sm-10');
                element.classList.add('col-sm-4');
            });

        }
        ArrumaBootstrap1(ArrumaBootstrap2);




        /* Verifica se o campo hora no chamado está preenchido
        // -------------------------------------------- */
        let HoraAlocada = '';
        function verificaHoraAlocada() {
            /* SE hora alocada for vazio
            // -------------------------------------------- */
            if (HoraAlocada === '') {
                //const popVerificaHoras = '<div class="JSverificaHora" role="alert">O campo <strong>Horas alocadas</strong> está vazio!</div>';
                const popVerificaHoras = '<div class="alert alert-warning alert-dismissible JSverificaHora" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Atenção!</strong> Preencha o campo horas alocadas.</div>';
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


    }

    /* CHAVEAMENTO DE PAGINA
    // ================================================== */
    if (url.includes('/forms-v2/finder/BPM_WORKFLOW_')) {
        console.log('PAGINA WORKFLOW');
        PaginaWorkflow();
        return;
    }
    if (url.includes('/forms-v2/bpmruntime.userflows.forms.bpm_workflow_')) {
        console.log('PAGINA CHAMADO');
        //PaginaChamado();
        setTimeout(PaginaChamado, 5000);
        return;
    }

    /*  SCROLL SUAVE
    // ================================================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

})();
