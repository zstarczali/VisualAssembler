#include "envelope.h"
#include <iostream>

int main() {
    mos6581_8580::EnvelopeGenerator envelope;
    envelope.writeATTACK_DECAY(0x00);
    envelope.writeSUSTAIN_RELEASE(0x80);
    for (int cycle = 0; cycle <= 120; ++cycle) {
        if (cycle == 0 || cycle == 100) envelope.writeCONTROL_REG(0x21);
        if (cycle == 50) envelope.writeCONTROL_REG(0x20);
        envelope.clock();
        if (cycle % 5 == 0 || cycle == 49 || cycle == 50 || cycle == 51 || cycle == 99 || cycle == 100 || cycle == 101) {
            std::cout << cycle << ':' << unsigned(envelope.readENV()) << '\n';
        }
    }
    mos6581_8580::EnvelopeGenerator delayed;
    delayed.writeATTACK_DECAY(0x90);
    delayed.writeSUSTAIN_RELEASE(0x80);
    delayed.writeCONTROL_REG(0x21);
    unsigned last = 0xaa;
    for (int cycle = 0; cycle <= 33'000; ++cycle) {
        if (cycle == 200) delayed.writeATTACK_DECAY(0x00);
        delayed.clock();
        const unsigned now = delayed.readENV();
        if (now != last) {
            std::cout << "delay " << cycle << ':' << now << '\n';
            last = now;
        }
    }
}
