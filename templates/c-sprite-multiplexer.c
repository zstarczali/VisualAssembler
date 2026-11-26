// @name Sprite multiplexer (16 sprites)
// @name.hu Sprite multiplexer (16 sprite)
// @category C (Oscar64)
// @category.hu C (Oscar64)
// @desc 16 virtual sprites on the 8 hardware sprites with the Oscar64 library (c64/sprites.h vspr_*, c64/rasterirq.h): sorted by Y every frame, re-used under a raster interrupt. The ball images, numbered 0-F, are drawn at start from the character ROM.
// @desc.hu 16 virtuális sprite a 8 hardveres sprite-on az Oscar64 könyvtárral (c64/sprites.h vspr_*, c64/rasterirq.h): frame-enként Y szerint rendezve, raszter megszakításban újrahasznosítva. A 0-F számozott labdák képét induláskor rajzolja a karakter ROM-ból.
// @order 50
#include <c64/vic.h>
#include <c64/rasterirq.h>
#include <c64/sprites.h>
#include <c64/memmap.h>
#include <math.h>
#include <string.h>

// {{PROJECT}}

#define Screen  ((char *)0x0400)
#define Sprites ((char *)0x0a00)        // 16 images x 64 bytes, VIC bank 0
#define CharRom ((const char *)0xd000)  // upper case set, screen code * 8

// the program starts after the sprite images
#pragma region( main, 0x0e00, 0xa000, , , {code, data, bss, heap, stack} )

#define NUM 16

int sintab[128];

// A filled ball (drawn once), copied 16 times with the sprite's number (0-F) cut out of its middle.
void draw_sprites(void)
{
    char * ball = Sprites;
    for (char y = 0; y < 21; y++)
    {
        for (char b = 0; b < 3; b++)
        {
            char bits = 0;
            for (char i = 0; i < 8; i++)
            {
                int dx = 2 * (8 * b + i) - 23, dy = 2 * y - 20;
                bits <<= 1;
                if (dx * dx + dy * dy <= 441)
                    bits |= 1;
            }
            ball[3 * y + b] = bits;
        }
    }
    ball[63] = 0;
    for (char n = 1; n < NUM; n++)
        memcpy(Sprites + 64 * n, ball, 64);

    // the character ROM is read with the I/O area paged out: no interrupt meanwhile
    __asm { sei }
    char pla = mmap_set(MMAP_CHAR_ROM);
    for (char n = 0; n < NUM; n++)
    {
        const char * glyph = CharRom + 8 * (n < 10 ? '0' + n : n - 9);
        for (char r = 0; r < 8; r++)
            Sprites[64 * n + 3 * (6 + r) + 1] ^= glyph[r];
    }
    mmap_set(pla);
    __asm { cli }
}

int main(void)
{
    vic.color_border = VCOL_BLACK;
    vic.color_back = VCOL_BLACK;
    memset(Screen, ' ', 1000);

    for (int i = 0; i < 128; i++)
        sintab[i] = (int)(70 * sin(i * PI / 64));

    draw_sprites();

    // raster interrupts through the KERNAL IRQ, then the multiplexer on top
    rirq_init(true);
    vspr_init(Screen);

    for (char i = 0; i < NUM; i++)
        vspr_set(i, 30 + 16 * i, 220 - 8 * i, (unsigned)Sprites / 64 + i, (i & 7) + 8);

    vspr_sort();
    vspr_update();
    rirq_sort();
    rirq_start();

    unsigned j = 0;
    for (;;)
    {
        char k = j >> 4;
        for (char i = 0; i < NUM; i++)
            vspr_move(i, 160 + sintab[(j + 8 * i) & 127] + sintab[k & 127],
                         150 + sintab[(j + 8 * i + 32) & 127] + sintab[(k + 32) & 127]);
        j++;

        // sort by Y, wait for the end of the frame, then the hardware sprites follow
        vspr_sort();
        rirq_wait();
        vspr_update();
        rirq_sort();
    }

    return 0;
}
