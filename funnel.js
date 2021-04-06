const colorArray = ["#3A86FF","#0CA4A5","#FB4D3D","#3D315B","#36393B","16262e"];

const options = {
    block: {
        dynamicHeight: true,
        minHeight: 20,
        highlight: true,
        fill: {
            type: 'gradient',
            scale: colorArray
        }
    },
    chart: {
        width: window.innerWidth / 3,
        height: window.innerHeight / 2,
        curve: {
            enabled: true
        }
    },
    label: {
        fontFamily: 'Poppins'
    }
};

//Chart 1
const data1 = [
    { label: 'Inquiries', value: 5000 },
    { label: 'Applicants', value: 2500 },
    { label: 'Admits', value: 500 },
    { label: 'Deposits', value: 200 },
];
const funnel1 = new D3Funnel('#funnel1');

//Chart 2
const data2 = [
    { label: 'Part 1', value: 400 },
    { label: 'Part 2', value: 100 },
    { label: 'Part 3', value: 150 },
    { label: 'Part 4', value: 75 },
];

const funnel2 = new D3Funnel('#funnel2');

//Chart 3
const data3 = [
    { label: 'Part 1', value: 1000 },
    { label: 'Part 2', value: 500 },
];

const funnel3 = new D3Funnel('#funnel3');

//Chart 4
const data4 = [
    { label: 'Part 1', value: 1000 },
    { label: 'Part 2', value: 500 },
    { label: 'Part 3', value: 2000 },
    { label: 'Part 4', value: 400 },
    { label: 'Part 5', value: 550 },
];

const funnel4 = new D3Funnel('#funnel4');

$( document ).ready(function() {
    generateFunnel();
    
    $("input[type='radio'][name='funnel']").on('change',function(){
        generateFunnel();
    });    
});

function generateFunnel(){
    const rbs = document.querySelectorAll("input[name='funnel']")
    let selectedFunnel;
    for(const rb of rbs){
        if(rb.checked){
            selectedFunnel = rb.value;
            break;
        }
    }
    switch(selectedFunnel){
        case 'funnel1':
            clearFunnel();
            funnel1.draw(data1,options);
            break;
        case 'funnel2':
            clearFunnel();
            funnel2.draw(data2,options);
            break;
        case 'funnel3':
            clearFunnel();
            funnel3.draw(data3,options);
            break;
        case 'funnel4':
            clearFunnel();
            funnel4.draw(data4,options);
            break;
    }
}

function clearFunnel(){
    d3.select('#funnel1').selectAll('svg').remove();
    d3.select('#funnel2').selectAll('svg').remove();
    d3.select('#funnel3').selectAll('svg').remove();
    d3.select('#funnel4').selectAll('svg').remove();
}