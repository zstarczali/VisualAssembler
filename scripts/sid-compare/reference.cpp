#include "sid.h"
#include <cstdint>
#include <fstream>
#include <iostream>

static void write_frame(reSID::SID& sid, int frame, int scenario) {
    const unsigned frequency = scenario == 0 || scenario == 3 ? 0x1200 : 0x5000;
    sid.write(0, frequency & 0xff);
    sid.write(1, frequency >> 8);
    sid.write(2, 0);
    sid.write(3, 8);
    sid.write(4, scenario == 13 || scenario == 14 ? 0x20 : scenario == 4 || scenario == 10 || scenario == 19 ? 0x41 : scenario == 9 || scenario == 18 ? 0x11 : 0x21);
    sid.write(5, 0x11);
    sid.write(6, 0x80);
    const unsigned cutoff = scenario == 13 ? 64 : scenario == 14 ? 512 : scenario == 17 || scenario == 20 ? 1500 : scenario >= 9 ? 1024 : scenario >= 5 ? (scenario == 5 ? 64 : scenario == 6 ? 512 : scenario == 7 ? 1024 : 1800) : 32 + (frame * 35) % 1900;
    sid.write(0x15, cutoff & 7);
    sid.write(0x16, cutoff >> 3);
    const bool filtered = scenario == 1 || scenario == 2 || scenario >= 5;
    sid.write(0x17, !filtered ? 0 : scenario == 15 ? 0x01 : scenario == 16 || scenario >= 18 ? 0xf1 : 0x61);
    sid.write(0x18, !filtered ? 0x0f : scenario == 11 ? 0x4f : scenario == 12 ? 0x2f : 0x1f);
}

int main(int argc, char** argv) {
    if (argc != 2) return 2;
    std::ofstream out(argv[1], std::ios::binary);
    if (!out) return 3;
    for (int scenario = 0; scenario < 21; ++scenario) {
        reSID::SID sid;
        sid.set_chip_model(scenario == 2 || scenario == 3 || scenario >= 5 ? reSID::MOS6581 : reSID::MOS8580);
        if (!sid.set_sampling_parameters(985248.0, reSID::SAMPLE_INTERPOLATE, 44100.0)) return 5;
        double remainder = 0;
        for (int frame = 0; frame < 50; ++frame) {
            write_frame(sid, frame, scenario);
            for (int sample = 0; sample < 882; ++sample) {
                remainder += 985248.0 / 44100.0;
                const int cycles = static_cast<int>(remainder);
                remainder -= cycles;
                for (int cycle = 0; cycle < cycles; ++cycle) sid.clock();
                const std::int16_t pcm = static_cast<std::int16_t>(sid.output());
                out.write(reinterpret_cast<const char*>(&pcm), sizeof(pcm));
            }
        }
    }
    return out ? 0 : 4;
}
