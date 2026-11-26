// @name Sprite multiplexer (64 sprites)
// @name.hu Sprite multiplexer (64 sprite)
// @category C (Oscar64)
// @category.hu C (Oscar64)
// @desc 64 multicolour balls on the 8 hardware sprites: eight rows of eight, a raster interrupt per row moves the sprites down and spreads them along a turning cylinder (c64/rasterirq.h rirq_build / rirq_write / rirq_call, an __interrupt routine). The ball is drawn at start.
// @desc.hu 64 többszínű labda a 8 hardveres sprite-on: nyolc sor, soronként nyolc; soronként egy raszter megszakítás viszi lejjebb a sprite-okat, és teríti szét őket egy forgó hengeren (c64/rasterirq.h rirq_build / rirq_write / rirq_call, __interrupt rutin). A labdát induláskor rajzolja.
// @order 60
#include <c64/vic.h>
#include <c64/rasterirq.h>
#include <string.h>

// {{PROJECT}}

#define Screen  ((char *)0x0400)
#define Ball    ((char *)0x0a00)        // the sprite image, VIC bank 0 (block 40)
#define ROWS    8

// the program starts after the sprite image
#pragma region( main, 0x0e00, 0xa000, , , {code, data, bss, heap, stack} )

// 30 * cos(2 pi i / 256): the horizontal step between the balls of a row
static const signed char costab[256] = {
     30,  30,  30,  30,  30,  30,  30,  30,  29,  29,  29,  29,  29,  28,  28,  28,
     28,  27,  27,  27,  26,  26,  26,  25,  25,  25,  24,  24,  23,  23,  22,  22,
     21,  21,  20,  20,  19,  18,  18,  17,  17,  16,  15,  15,  14,  13,  13,  12,
     11,  11,  10,   9,   9,   8,   7,   7,   6,   5,   4,   4,   3,   2,   1,   1,
      0,  -1,  -1,  -2,  -3,  -4,  -4,  -5,  -6,  -7,  -7,  -8,  -9,  -9, -10, -11,
    -11, -12, -13, -13, -14, -15, -15, -16, -17, -17, -18, -18, -19, -20, -20, -21,
    -21, -22, -22, -23, -23, -24, -24, -25, -25, -25, -26, -26, -26, -27, -27, -27,
    -28, -28, -28, -28, -29, -29, -29, -29, -29, -30, -30, -30, -30, -30, -30, -30,
    -30, -30, -30, -30, -30, -30, -30, -30, -29, -29, -29, -29, -29, -28, -28, -28,
    -28, -27, -27, -27, -26, -26, -26, -25, -25, -25, -24, -24, -23, -23, -22, -22,
    -21, -21, -20, -20, -19, -18, -18, -17, -17, -16, -15, -15, -14, -13, -13, -12,
    -11, -11, -10,  -9,  -9,  -8,  -7,  -7,  -6,  -5,  -4,  -4,  -3,  -2,  -1,  -1,
      0,   1,   1,   2,   3,   4,   4,   5,   6,   7,   7,   8,   9,   9,  10,  11,
     11,  12,  13,  13,  14,  15,  15,  16,  17,  17,  18,  18,  19,  20,  20,  21,
     21,  22,  22,  23,  23,  24,  24,  25,  25,  25,  26,  26,  26,  27,  27,  27,
     28,  28,  28,  28,  29,  29,  29,  29,  29,  30,  30,  30,  30,  30,  30,  30
};

// set by each row's raster interrupt before it calls next_row()
char phase;     // the turn of the whole cylinder, advanced every frame
char rowphase;  // this row's own offset
char rowy;      // this row's sprite Y

// A multicolour ball: black rim (multicolour 0), the sprite's colour, a white spot (multicolour 1).
void draw_ball(void)
{
    memset(Ball, 0, 64);
    for (char y = 0; y < 21; y++)
    {
        for (char px = 0; px < 12; px++)
        {
            // in half hires pixels: a multicolour pixel is 4 wide, a line 2 high
            int hx = 4 * px + 2 - 24, hy = 2 * y - 20;
            int d = hx * hx + hy * hy;
            char c = 0;
            if (d <= 420)
            {
                int sx = hx + 8, sy = hy + 8;
                c = d > 300 ? 1 : sx * sx + sy * sy <= 40 ? 3 : 2;
            }
            Ball[3 * y + (px >> 2)] |= c << (6 - 2 * (px & 3));
        }
    }
}

// The next row: the new Y first (it only takes effect below the current row), then the X positions
// once the last line of the current row has started.
__interrupt void next_row(void)
{
    #pragma unroll(full)
    for (char i = 0; i < 8; i++)
        vic.spr_pos[i].y = rowy;

    char ph = phase + rowphase;
    int step = costab[ph];
    int left = 172 - (step >> 1), right = 172 + (step >> 1);
    static unsigned xs[8];
    #pragma unroll(full)
    for (char i = 0; i < 4; i++)
    {
        xs[3 - i] = left;
        xs[4 + i] = right;
        left -= step;
        right += step;
    }

    // the front half of the cylinder is drawn by the low sprites (they are on top): the order flips
    // with the turn
    bool flip = (ph & 0x80) != 0;
    char msb = 0;
    #pragma unroll(full)
    for (char i = 0; i < 8; i++)
        msb = ((unsigned)msb | (xs[flip ? i : 7 - i] & 0xff00)) >> 1;

    vic_waitLine(rowy - 3);
    #pragma unroll(full)
    for (char i = 0; i < 8; i++)
    {
        char k = flip ? i : 7 - i;
        vic.spr_pos[i].x = xs[k];
        vic.spr_color[i] = VCOL_ORANGE + k;
    }
    vic.spr_msbx = msb;
}

RIRQCode rows[ROWS];

int main(void)
{
    vic.color_border = VCOL_BLACK;
    vic.color_back = VCOL_BLACK;
    memset(Screen, ' ', 1000);
    draw_ball();

    // raster interrupts through the KERNAL IRQ
    rirq_init(true);

    for (char i = 0; i < 8; i++)
        Screen[0x03f8 + i] = (unsigned)Ball / 64;
    vic.spr_enable = 0xff;
    vic.spr_multi = 0xff;
    vic.spr_expand_x = 0;
    vic.spr_expand_y = 0;
    vic.spr_mcolor0 = VCOL_BLACK;
    vic.spr_mcolor1 = VCOL_WHITE;

    // one interrupt per row, 16 lines above it: store the row's offset and Y, then call next_row
    for (char i = 0; i < ROWS; i++)
    {
        rirq_build(rows + i, 3);
        rirq_write(rows + i, 0, &rowphase, 11 * i);
        rirq_write(rows + i, 1, &rowy, 52 + 25 * i);
        rirq_call(rows + i, 2, next_row);
        rirq_set(i, 36 + 25 * i, rows + i);
    }
    rirq_sort();
    rirq_start();

    for (;;)
    {
        phase += 5;
        vic_waitFrame();
    }

    return 0;
}
