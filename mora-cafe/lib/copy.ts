export const coffees=[
 {name:'Mora Aurora',roast:'Clara',level:2,notes:'Flor de laranjeira, mel e frutas amarelas',origin:'Serra da Mantiqueira',batch:'MRC-0325',price:52,profile:[4,5,2],color:'light'},
 {name:'Mora Tradição',roast:'Média',level:3,notes:'Chocolate e caramelo',origin:'Sul de Minas',batch:'MRC-0324',price:48,profile:[5,3,4],color:'medium'},
 {name:'Mora Noite',roast:'Escura',level:4,notes:'Cacau amargo, avelã e especiarias',origin:'Cerrado Mineiro',batch:'MRC-0326',price:46,profile:[3,1,5],color:'dark'},
] as const;
export const roastStages=[
 {time:'00:00',temp:24,title:'Grão verde',copy:'Entra no tambor cru, sem aroma e com cerca de 11% de umidade.'},
 {time:'04:00',temp:150,title:'Secagem',copy:'A umidade sai e o grão amarela. O cheiro lembra pão fresco.'},
 {time:'08:30',temp:196,title:'Primeiro estalo',copy:'O grão estala e se expande. É aqui que nascem o chocolate e o caramelo.'},
 {time:'10:30',temp:212,title:'Ponto Mora',copy:'Paramos logo depois do estalo. Torra média: doce, redonda e de final longo.'},
];
