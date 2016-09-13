export default function DecomposeMatrix (mat)
{
    //  QR Decomposition

    let a = mat.a;
    let b = mat.b;
    let c = mat.c;
    let d = mat.d;
    let e = mat.e;
    let f = mat.f;

    let translate = { x: e, y: f };
    let rotation = 0;
    let scale = { x: 1, y: 1 };
    let skew = { x: 0, y: 0 };

    let determ = (a * d) - (b * c);

    if (a || b)
    {
        let r = Math.sqrt((a * a) + (b * b));
        rotation = (b > 0) ? Math.acos(a / r) : -Math.acos(a / r);
        scale = { x: r, y: determ / r };
        skew.x = Math.atan(((a * c) + (b * d)) / (r * r));
    }
    else if (c || d)
    {
        var s = Math.sqrt((c * c) + (d * d));
        rotation = (Math.PI * 0.5) - (d > 0 ? Math.acos(-c / s) : -Math.acos(c / s));
        scale = {x: determ / s, y: s};
        skew.y = Math.atan(((a * c) + (b * d)) / (s * s));
    }
    else
    {
        scale = { x: 0, y: 0 };
    }

    return {
        translate,
        rotation,
        scale,
        skew
    };

}
