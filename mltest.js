var ctx, w, h;
var bots = [], info = [];
var c = 1, cb, g = 1, hitLs = [];
var s, inc = 5;

window.onload = function() {
    var canv = document.querySelector("canvas");
    canv.width = w = window.innerWidth;
    canv.height = h = window.innerHeight;
    ctx = canv.getContext("2d");
    
    for (var i = 0; i < inc; i++, c++) {
        bots.push(new Bot(w / 2, h - 80, c, null, 50));
    }
    cb = inc;
    
    var infoObjs = [
        ["Generation: ", "g"],
        ["Current Bots: ", "cb"],
        ["Total Bots: ", "c - 1"],
        ["Mean Stops: ", "getMeanHits()"]
    ];
    
    for (var i = 0; i < infoObjs.length; i++) {
        info.push(new Info(infoObjs[i][0], infoObjs[i][1], i));
    }
    
    window.requestAnimationFrame(main);
}

var passedHits = [];
function main() {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#F00";
    ctx.fillRect(w / 2 - 40, h / 2 - 160, 80, 80);
    
    s = document.querySelector("input").value;
    
    for (var i = 0; i < bots.length; i++) {
        var b = bots[i];
        b.update();
        b.render();
        if ((b.x + 10 >= w / 2 - 40 && b.x <= w / 2 + 40) && (b.y + 10 >= h / 2 - 160 && b.y <= h / 2 - 80)) {
            b.hits.push([b.tx, b.ty]);
            passedHits.push(b.hits);
            hitLs.push(b.hits.length);
            bots.splice(i, 1);
            i--;
            cb--;
            if (!bots.length) {
                var shortest = 0;
                for (var i = 0; i < passedHits.length; i++) {
                    if (passedHits[shortest].length > passedHits[i].length) {
                        shortest = i;
                    }
                }
                
                var sCount = 0;
                for (var i = 0; i < passedHits.length; i++) {
                    if (passedHits[shortest].length == passedHits[i].length) {
                        sCount++;
                    }
                }
                
                for (var i = 0; i < inc; i++, c++) {
                    var accuracy = Math.floor((1 / passedHits[shortest].length) * (Math.random() + 3));
                    var g1 = g;
                    if (g > 5) {g1 = 5}
                    
                    if (Math.floor((Math.random() + 0.25) * accuracy * sCount)) {
                        bots.push(new Bot(w / 2, h - 80, c, passedHits[shortest], 50 / ((accuracy * (Math.random() + 0.5)) ** g1)));
                    } else {
                        bots.push(new Bot(w / 2, h - 80, c, null, 50 / ((accuracy * (Math.random() + 0.5)) ** g1))); // ** g may cause lag
                    }
                }
                g++;
                cb = inc;
                passedHits.length = 0;
            }
        }
    }
    
    for (var i = 0; i < info.length; i++) {
        info[i].update();
        info[i].render();
    }
    
    window.requestAnimationFrame(main);
}

class Bot {
    constructor(x, y, t, hq, p) {
        this.x = x;
        this.y = y;
        this.tag = t;
        this.hitque = hq;
        this.p = p;
        this.hqindex = 0;
        this.hits = [];
        
        if (this.hitque) {
            this.tx = Math.floor(Math.random() * this.p - (this.p / 2) + this.hitque[0][0]);
            this.ty = Math.floor(Math.random() * this.p - (this.p / 2) + this.hitque[0][1]);
            this.hqindex++;
        } else {
            this.tx = Math.floor(Math.random() * (w + 1));
            this.ty = Math.floor(Math.random() * (h + 1));
            if ((this.tx + 3 >= w / 2 - 40 && this.tx <= w / 2 + 40) && (this.ty + 3 >= h / 2 - 160 && this.ty <= h / 2 - 80)) {
                while ((this.tx + 3 >= w / 2 - 40 && this.tx <= w / 2 + 40) && (this.ty + 3 >= h / 2 - 160 && this.ty <= h / 2 - 80)) {
                    this.tx = Math.floor(Math.random() * (w + 1));
                    this.ty = Math.floor(Math.random() * (h + 1));
                }
            }
        }
    }
    
    update() {
        var a = Math.atan2(this.ty - this.y - 5, this.tx - this.x - 5);
        this.x += s * Math.cos(a);
        this.y += s * Math.sin(a);
        if (((this.x + 10 >= this.tx) && (this.x  <= this.tx + 3)) && ((this.y + 10 >= this.ty) && (this.y <= this.ty + 3))) {
            this.hits.push([this.tx, this.ty]);
            
            if (this.hitque) {
                if (this.hitque[this.hqindex]) {
                    this.tx = Math.floor(Math.random() * this.p - (this.p / 2) + this.hitque[this.hqindex][0]);
                    this.ty = Math.floor(Math.random() * this.p - (this.p / 2) + this.hitque[this.hqindex][1]);
                    this.hqindex++;
                } else {
                    this.tx = Math.floor(Math.random() * (w + 1));
                    this.ty = Math.floor(Math.random() * (h + 1));
                    if ((this.tx + 3 >= w / 2 - 40 && this.tx <= w / 2 + 40) && (this.ty + 3 >= h / 2 - 160 && this.ty <= h / 2 - 80)) {
                        while ((this.tx + 3 >= w / 2 - 40 && this.tx <= w / 2 + 40) && (this.ty + 3 >= h / 2 - 160 && this.ty <= h / 2 - 80)) {
                            this.tx = Math.floor(Math.random() * (w + 1));
                            this.ty = Math.floor(Math.random() * (h + 1));
                        }
                    }
                }
            } else {
                this.tx = Math.floor(Math.random() * (w + 1));
                this.ty = Math.floor(Math.random() * (h + 1));
                if ((this.tx + 3 >= w / 2 - 40 && this.tx <= w / 2 + 40) && (this.ty + 3 >= h / 2 - 160 && this.ty <= h / 2 - 80)) {
                    while ((this.tx + 3 >= w / 2 - 40 && this.tx <= w / 2 + 40) && (this.ty + 3 >= h / 2 - 160 && this.ty <= h / 2 - 80)) {
                        this.tx = Math.floor(Math.random() * (w + 1));
                        this.ty = Math.floor(Math.random() * (h + 1));
                    }
                }
            }
        }
    }
    
    render() {
        ctx.fillStyle = "#00F";
        ctx.fillRect(this.x, this.y, 10, 10);
        ctx.strokeStyle = "#000";
        ctx.beginPath();
        ctx.moveTo(this.x + 5, this.y + 5);
        ctx.lineTo(this.tx, this.ty);
        ctx.stroke();
        ctx.fillStyle = "#448";
        ctx.fillRect(this.tx - 1.5, this.ty - 1.5, 3, 3);
        ctx.font = "12px Arial";
        ctx.fillStyle = "#700";
        ctx.fillText(this.tag, this.x - 10, this.y + 2);
    }
}

class Info {
    constructor(l, vu, i) {
        this.l = l;
        this.vu = vu;
        this.v = eval(this.vu);
        this.i = i;
    }
    
    update() {
        this.v = eval(this.vu);
    }
    
    render() {
        ctx.font = "10px Arial";
        ctx.fillStyle = "#000";
        ctx.fillText(this.l + this.v, 4, 12 + 14 * this.i);
    }
}

function getMeanHits() {
    if (hitLs.length) {
        var sum = 0;
        for (var i = 0; i < hitLs.length; i++) {
            sum += hitLs[i];
        }
        return (sum / hitLs.length).toFixed(2);
    } else {
        return "Waiting";
    }
}

// The AI is challenged (randomized target points cannot fall in the central goal). To undo this, comment out certain parts of the code, as shown (where "@ *" and "* @" represent comment markers):

/*
            this.tx = Math.floor(Math.random() * (w + 1));
            this.ty = Math.floor(Math.random() * (h + 1));
          @ * if ((this.tx + 3 >= w / 2 - 40 && this.tx <= w / 2 + 40) && (this.ty + 3 >= h / 2 - 160 && this.ty <= h / 2 - 80)) {
                while ((this.tx + 3 >= w / 2 - 40 && this.tx <= w / 2 + 40) && (this.ty + 3 >= h / 2 - 160 && this.ty <= h / 2 - 80)) {
                    this.tx = Math.floor(Math.random() * (w + 1));
                    this.ty = Math.floor(Math.random() * (h + 1));
                }
            } * @
*/