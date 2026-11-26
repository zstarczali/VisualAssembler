// @name Text screen
// @name.hu Szöveges képernyő
// @category C (Oscar64)
// @category.hu C (Oscar64)
// @desc Writes the screen and colour RAM directly: a coloured title and a frame, then waits for a key.
// @desc.hu Közvetlenül írja a képernyő- és színmemóriát: színes cím és keret, majd billentyűre vár.
// @order 40
#include <c64/vic.h>
#include <conio.h>
#include <string.h>

// {{PROJECT}}

static char * const Screen = (char *)0x0400;
static char * const Color = (char *)0xd800;

static void put(char x, char y, const char * text, char color)
{
    for (char i = 0; text[i]; i++)
    {
        char c = text[i];
        if (c >= 'A' && c <= 'Z') c -= 'A' - 1;   // screen code of a capital letter
        Screen[y * 40 + x + i] = c;
        Color[y * 40 + x + i] = color;
    }
}

int main(void)
{
    vic.color_border = VCOL_BLUE;
    vic.color_back = VCOL_BLACK;
    memset(Screen, ' ', 1000);
    memset(Color, VCOL_LT_BLUE, 1000);

    for (char x = 0; x < 40; x++)
    {
        Screen[x] = Screen[960 + x] = 0x40;
    }
    put(12, 10, "COMMODORE 64", VCOL_YELLOW);
    put(10, 12, "WRITTEN IN C", VCOL_WHITE);
    put(9, 20, "PRESS A KEY", VCOL_LT_GREEN);

    getch();
    return 0;
}
