window.onload = init;

function init()
{
    var canvas = document.getElementById('canvas');
    ParticleSystem.init(canvas);

    setInterval(function()
    {
        document.getElementById("framerate").innerHTML =
            "FPS: " + ParticleSystem.framerate();
    }, 1000);
}

function resetControls()
{
    var defaultParticleCount = 300;
    var defaultGravity = 0.15;
    var defaultFriction = 1.00;

    document.getElementById("particles").value = defaultParticleCount;
    document.getElementById("particles-value").innerHTML = defaultParticleCount;
    document.getElementById("gravity").value = defaultGravity;
    document.getElementById("gravity-value").innerHTML = defaultGravity.toFixed(2);
    document.getElementById("friction").value = defaultFriction;
    document.getElementById("friction-value").innerHTML = defaultFriction.toFixed(2);

    ParticleSystem.updateParticleCount(defaultParticleCount);
    ParticleSystem.updateGravity(defaultGravity);
    ParticleSystem.updateFriction(defaultFriction);
}

function updateVars(control)
{
    var value = parseFloat(control.value);
    var label = document.getElementById(control.id + '-value');

    if(control.id == 'particles')
    {
        ParticleSystem.updateParticleCount(value);
        label.innerHTML = value;
    }
    else if(control.id == 'gravity')
    {
        ParticleSystem.updateGravity(value);
        label.innerHTML = value.toFixed(2);

    }
    else if(control.id == 'friction')
    {
        ParticleSystem.updateFriction(value);
        label.innerHTML = value.toFixed(2);
    }
}