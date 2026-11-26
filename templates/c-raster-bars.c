// @name Raster bars
// @name.hu Raszter csíkok
// @category C (Oscar64)
// @category.hu C (Oscar64)
// @desc Eight raster interrupts change the border and background colour down the screen (c64/rasterirq.h).
// @desc.hu Nyolc raszter-megszakítás váltja a keret és a háttér színét a képernyőn lefelé (c64/rasterirq.h).
// @order 20
#include <c64/vic.h>
#include <c64/rasterirq.h>

// {{PROJECT}}

#define BARS 8

static RIRQCode bars[BARS];

int main(void)
{
    rirq_init(true);
    for (char i = 0; i < BARS; i++)
    {
        rirq_build(bars + i, 2);
        rirq_write(bars + i, 0, &vic.color_border, i + 2);
        rirq_write(bars + i, 1, &vic.color_back, i + 2);
        rirq_set(i, 50 + i * 24, bars + i);
    }
    rirq_sort();
    rirq_start();

    for (;;)
        rirq_wait();
    return 0;
}
