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
    this.color = (color) ? color : "#000";

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
        context.fillStyle = this.color;
        context.beginPath();
        context.arc(0, 0, 2, 0, (Math.PI * 2), true);
        context.closePath();
        context.fill();
        context.restore();
    };

    Ball.prototype = new Particle();
};

var ParticleSystem = function(canvas)
{
    this.canvas = canvas;
    var particles = Array(100);
    var context;

    this.init = function()
    {
        context = this.canvas.getContext('2d');
        context.fillStyle = 'black';
        context.fillRect(0, 0, this.canvas.width, this.canvas.height);

        for(var i = 0; i < particles.length; i++)
        {
            var particle = (Math.random() < 0.5)
                ? new Shard(randomColor())
                : new Ball(randomColor());
            initParticle(particle);
            particles[i] = particle;
        }

        update();
    };

    var initParticle = function(particle)
    {
        particle.x = this.canvas.width / 2;
        particle.y = this.canvas.height / 2;
        particle.vx = Math.random() * 10 - 5;
        particle.vy = Math.random() * 10 - 5;
        particle.scaleX = 1;
        particle.scaleY = 1;
        particle.gravity = 0.15;
        particle.friction = 1;
    };

    // main render loop
    var update = function()
    {
        context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        for(var i = 0; i < particles.length; i++)
        {
            var particle = particles[i];
            
            particle.update(context);
            particle.scaleX += 0.025;
            particle.scaleY += 0.025;

            if(particle.x > this.canvas.width ||
                particle.y > this.canvas.height ||
                particle.x < 0 ||
                particle.y < 0)
            {
                initParticle(particle);
            }
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