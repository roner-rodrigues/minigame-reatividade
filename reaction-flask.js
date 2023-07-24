// Reaction flask logic
const SOUNDS = {
    SUCCESS: 'sucess-reaction.wav',
    FAIL:   'fail-reaction.wav',
};

// Function to simulate sleep
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function playSound(code) {
    // Crie um novo objeto Audio e especifique o caminho do arquivo de áudio
    var audio = new Audio('sounds/' + SOUNDS[code]);
    
    // Toca o áudio
    audio.play();
}

function tryReaction() {
    let recipient1ReactLevel = $('#blade').attr('class')
        .split(' ')
        .find((cls) => cls.startsWith('elem-reactLevel-'));

    let recipient2ReactLevel = $('#flask').attr('class')
        .split(' ')
        .find((cls) => cls.startsWith('elem-reactLevel-'));

    let recipient1ElemName = $('#blade').attr('class')
        .split(' ')
        .find((cls) => cls.startsWith('elem-name-'));

    let recipient2ElemName = $('#flask').attr('class')
        .split(' ')
        .find((cls) => cls.startsWith('elem-name-'));
    
    if (!recipient1ReactLevel || !recipient2ReactLevel || !recipient1ElemName || !recipient2ElemName) 
        return false;

    // Extract the react level values
    recipient1ReactLevel = parseInt(recipient1ReactLevel.substring(16), 10);
    recipient2ReactLevel = parseInt(recipient2ReactLevel.substring(16), 10);

    // Extract the element name values
    recipient1ElemName = recipient1ElemName.substring(10);
    recipient2ElemName = recipient2ElemName.substring(10);

    // Caso o metal da lâmina (Recipiente 1) seja mais reativo que a solução (recipiente 2), então ocorre reação.
    let htmlContent;
    if(recipient1ReactLevel > recipient2ReactLevel) {
        playSound("SUCCESS");
        htmlContent = 'Ocorre reação!';
    }
    else {
        playSound("FAIL");
        htmlContent = 'Não ocorre reação...';
    }
        
    $('#modal-parameter').html(htmlContent);
    $('#reactionModal').modal('show');
}

$(document).ready(function () {
    $('#btn-mix').click(function() {
        tryReaction();
    });
    
    $('#btn-mix-2').click(function () {
        $('#reaction-liquid').removeClass('fill');
        $('#reaction-liquid').removeClass(function(index, className) {
            return (className.match(/(^|\s)elem-color-\S+/g) || []).join(' ');
        });

        $('#falling-blade').remove();


        // Get the color class from blade
        let bladeColor = $('#blade').attr('class')
        .split(' ')
        .find((cls) => cls.startsWith('elem-color-'));
        
        // Get the color class from solution flask
        let flaskColor = $('#flask').attr('class')
        .split(' ')
        .find((cls) => cls.startsWith('elem-color-'));
        
        // Ajusta a cor da mistura 
        $('#reaction-liquid').addClass(flaskColor);
        
        // Preenche o recipiente da mistura 
        $('#reaction-liquid').addClass('fill');
        
        // Cria o bloco para o elemento da lâmina
        let block = $('<div>', {
            id: 'falling-blade',
            class: 'falling-blade recipient',
        });
        block.addClass(bladeColor);
        
        // Joga o bloco dentro da solução
        $('#reaction-flask').append(block); 
        
        tryReaction();
        
        
       
    });

    
});
