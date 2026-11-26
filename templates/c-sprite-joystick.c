// @name Sprite and joystick
// @name.hu Sprite és joystick
// @category C (Oscar64)
// @category.hu C (Oscar64)
// @desc A ball sprite moved by the joystick in port 2, one step per frame; fire changes its colour.
// @desc.hu Joystickkal (2. port) mozgatott labda sprite, frame-enként egy lépés; a tűzgomb színt vált.
// @order 30
#include <c64/vic.h>
#include <c64/sprites.h>
#include <c64/joystick.h>
#include <string.h>

// {{PROJECT}}

static char * const Screen = (char *)0x0400;
static char * const SpriteData = (char *)0x0340;    // sprite image 13 (cassette buffer)

static const char ball[63] = {
    0x00, 0x7e, 0x00, 0x01, 0xff, 0x80, 0x07, 0xff, 0xe0, 0x0f, 0xff, 0xf0,
    0x1f, 0xff, 0xf8, 0x1f, 0xff, 0xf8, 0x3f, 0xff, 0xfc, 0x3f, 0xff, 0xfc,
    0x7f, 0xff, 0xfe, 0x7f, 0xff, 0xfe, 0x7f, 0xff, 0xfe, 0x7f, 0xff, 0xfe,
    0x7f, 0xff, 0xfe, 0x3f, 0xff, 0xfc, 0x3f, 0xff, 0xfc, 0x1f, 0xff, 0xf8,
    0x1f, 0xff, 0xf8, 0x0f, 0xff, 0xf0, 0x07, 0xff, 0xe0, 0x01, 0xff, 0x80,
    0x00, 0x7e, 0x00
};

int main(void)
{
    memcpy(SpriteData, ball, 63);
    spr_init(Screen);

    int x = 160, y = 140;
    char color = VCOL_YELLOW;
    bool fired = false;
    spr_set(0, true, x, y, 0x0340 / 64, color, false, false, false);

    for (;;)
    {
        vic_waitFrame();
        joy_poll(0);
        x += joyx[0] * 2;
        y += joyy[0] * 2;
        if (x < 24) x = 24; else if (x > 320) x = 320;
        if (y < 50) y = 50; else if (y > 229) y = 229;
        if (joyb[0] && !fired) { color = (color + 1) & 15; spr_color(0, color); }
        fired = joyb[0];
        spr_move(0, x, y);
    }
    return 0;
}
