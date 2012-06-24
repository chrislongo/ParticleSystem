// 2012 Chris Longo (cal@chrislongo.net)

var Particle = function(color)
{
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.gravity = 0;
    this.friction = 1;
    this.rotation = 0;
    this.scaleX = 1;
    this.scaleY = 1;
    this.alpha = 1;
    this.color = (color) ? color : 'black';

    Particle.prototype.update = function(context)
    {
        this.vx *= this.friction;
        this.vy *= this.friction;
        
        this.vy += this.gravity;
        
        this.x += this.vx;
        this.y += this.vy;

        this.rotation = Math.atan2(this.vy, this.vx);
    };
};

var Shard = function(color)
{
    Particle.call(this, color);

    this.update = function(context)
    {
        Particle.prototype.update.call(this, context);

        context.save();
        context.translate(this.x, this.y);
        context.rotate(this.rotation);
        context.scale(this.scaleX, this.scaleY);
        context.globalAlpha = this.alpha;
        context.strokeStyle = this.color;
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(5, 0);
        context.lineTo(-5, -5);
        context.lineTo(-5, 5);
        context.lineTo(5, 0);
        context.closePath();
        context.stroke();
        context.restore();
    };

    Shard.prototype = new Particle();
};

var Ball = function(color)
{
    Particle.call(this, color);

    this.update = function(context)
    {
        Particle.prototype.update.call(this, context);

        context.save();
        context.translate(this.x, this.y);
        context.rotate(this.rotation);
        context.scale(this.scaleX, this.scaleY);
        context.globalAlpha = this.alpha;
        context.fillStyle = this.color;
        context.beginPath();
        context.arc(0, 0, 2, 0, (Math.PI * 2), true);
        context.closePath();
        context.fill();
        context.restore();
    };

    Ball.prototype = new Particle();
};

// yes, I am the only person I know who uses this style of coding
// it's simplier to look at than the alternatives and does a good job
// of hiding local vars
var ParticleSystem = new function()
{
    var canvas;
    var context;
    var buffer;
    var bufferContext;
    var width;
    var height;
    
    var particles = Array(500);
    var particleCount = 300;
    var gravity = 0.15;
    var friction = 1;
    
    var start = new Date();
    var frames = 0;
    var paused = 0;

    this.init = function(canvasElement)
    {
        canvas = canvasElement;
        width = canvas.width;
        height = canvas.height;

        context = canvas.getContext('2d');
        context.fillStyle = 'black';

        for(var i = 0; i < particles.length; i++)
        {
            var particle = (Math.random() < 0.5)
                ? new Shard(randomColor())
                : new Ball(randomColor());
            
            initParticle(particle);
            particles[i] = particle;
        }

        canvas.onclick = function()
        {
            paused = !paused;
        };

        initBuffer();
        update();
    };

    var initBuffer = function()
    {
        buffer = document.createElement('canvas');
        buffer.width = width;
        buffer.height = height;
        buffer.style.visibility = 'hidden';
        
        bufferContext = buffer.getContext("2d");
    };

    var initParticle = function(particle)
    {
        particle.x = canvas.width / 2;
        particle.y = canvas.height / 2;
        particle.vx = Math.random() * 10 - 5;
        particle.vy = Math.random() * 10 - 5;
        particle.scaleX = 1;
        particle.scaleY = 1;
        particle.gravity = gravity;
        particle.friction = friction;
        particle.alpha = 0;
    };

    // main render loop
    var update = function()
    {
        if(!paused)
        {
            bufferContext.fillRect(0, 0, width, height);

            for(var i = particleCount; i--;)
            {
                var particle = particles[i];
                
                particle.update(bufferContext);

                if(particle.x > canvas.width ||
                    particle.y > canvas.height ||
                    particle.x < 0 ||
                    particle.y < 0)
                {
                    initParticle(particle);
                    continue;
                }

                particle.scaleX += 0.025;
                particle.scaleY += 0.025;
                particle.alpha += 0.03;
                particle.friction = friction;
                particle.gravity = gravity;
            }

            // z-order sort. alpha indicates depth ;)
            particles.sort(function(a, b) { return b.alpha - a.alpha; });

            // double-buffering
            context.drawImage(buffer, 0, 0, width, height);
            frames++;
        }
        
        requestAnimFrame(function() { update(); });
    };

    var randomColor = function()
    {
        var color =
            (Math.random() * 255) << 16 |
            (Math.random() * 255) << 8 |
            (Math.random() * 255);

        return "#" + ("00000" + (color).toString(16)).slice(-6);
    };

    this.updateParticleCount = function(value)
    {
        particleCount = value;

        for(var i = particleCount; i < particles.length; i++)
            initParticle(particles[i]);
    };

    this.updateGravity = function(value)
    {
        gravity = value;
    };

    this.updateFriction = function(value)
    {
        friction = value;
    };

    this.framerate = function()
    {
        var now = new Date();
        var seconds = (now - start) / 1000;
        var rate = frames / seconds;

        start = now;
        frames = 0;

        return Math.round(rate);
    };
};

window.requestAnimFrame = (function(callback){
    return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback){
        window.setTimeout(callback, 1000 / 60);
    };
})();