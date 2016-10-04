(function ()
{
    var app = angular.module('caSearch', []);
    app.controller('CaController', function ()
    {
        this.units = cas;
    }
    );

    app.controller('SearchController', function ()
    {
        this.search = {};

        this.submitForm = function ()
        {
            console.log(this.search);
            //submit to the api
            this.search = {};
        };

    }
    );

    var cas = [
        {
            "number" : "29481",
            "date" : "07/10/2016",
            "status" : "VÁLIDO",
            "processNumber" : "46017.008072/2011-88",
            "cnpj" : "83.054.437/0001-35",
            "company" : "VIPOSA S.ABOTINAabcdefghijklmnopqrstuvwxyz",
            "origin" : "Nacional",
            "equipment" : "CALÇADO TIPO BOTINAabcdefghijklmnopqrstuvwxyz",
            "description" : "Calçado de segurança tipo botina, modelo derby, fechamento em cadarço, confeccionado em couro, forrado em tecido, palmilha de montagem em fibras não metálicas antiperfurantes montada pelo sistema strobel, solado em poliuretano bidensidade  injetado diretamente no cabedal, biqueira em composite, resistente à passagem de corrente elétrica.",
            "caLocation" : "Parte externa",
            "references" : "\"12\"",
            "colors" : "",
            "reports" : [
                {
                    "laboratoryCNPJ" : "00.357.038/0018-64",
                    "laboratoryName" : "CENTRAIS ELETRICAS DO NORTE DO BRASIL S/A ELETRONORTE",
                    "reportNumber" : "RT052512011"
                },
                {
                    "laboratoryCNPJ" : "60.633.674/0006-60",
                    "laboratoryName" : "INSTITUTO DE PESQUISAS TECNOLOGICAS DO ESTADO DE SAO PAULO SA IPT",
                    "reportNumber" : "1024977-203/2011"
                }
            ],
            "approvedFor" : "PROTEÇÃO DOS PÉS DO USUÁRIO CONTRA IMPACTOS DE QUEDAS DE OBJETOS SOBRE OS ARTELHOS E CONTRA AGENTES ABRASIVOS E ESCORIANTES.",
            "restrictions" : "",
            "observation" : "I) CALÇADO RESISTENTE À PENETRAÇÃO E À PASSAGEM DE CORRENTE ELÉTRICA.",
            "technicalRules" : [
                "ABNT NBR ISO 20345:2008",
                "ABNT NBR ISO 20344:2008"
            ]
        },
        {
            "number" : "25047",
            "date" : "27/05/2014",
            "status" : "VENCIDO",
            "processNumber" : "46000.007678/2009-61",
            "cnpj" : "83.054.437/0001-35",
            "company" : "VIPOSA S.A",
            "origin" : "Nacional",
            "equipment" : "CALÇADO TIPO BOTINA",
            "description" : "Calçado de segurança antiestático de uso profissional tipo botina, modelo derby, fechamento em cadarço, confeccionado em couro curtido ao cromo, cano acolchoado, forrado, palmilha de montagem em couro montada pelo sistema strobel, com biqueira de aço, solado de poliuretano bidensidade injetado diretamente no cabedal.",
            "caLocation" : "NA LINGUETA",
            "references" : "MODELO 174-CB",
            "colors" : "",
            "reports" : [
                {
                    "laboratoryCNPJ" : "60.633.674/0006-60",
                    "laboratoryName" : "INSTITUTO DE PESQUISAS TECNOLOGICAS DO ESTADO DE SAO PAULO SA IPT",
                    "reportNumber" : "990 957-203/2009"
                }
            ],
            "approvedFor" : "PROTEÇÃO DOS PÉS DO USUÁRIO CONTRA IMPACTOS DE QUEDAS DE OBJETOS SOBRE OS ARTELHOS.",
            "restrictions" : "",
            "observation" : "",
            "technicalRules" : [
                "ABNT NBR 12594:1992"
            ]
        }
    ]

}
)();
