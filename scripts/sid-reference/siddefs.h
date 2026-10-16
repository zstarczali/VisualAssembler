#ifndef mos6581_8580_SIDDEFS_H
#define mos6581_8580_SIDDEFS_H

#define mos6581_8580_INLINING 1
#define mos6581_8580_INLINE inline
#define mos6581_8580_BRANCH_HINTS 0
#define NEW_8580_FILTER 0
#define HAVE_BOOL 1
#define HAVE_BUILTIN_EXPECT 0
#define HAVE_LOG1P 0

#define likely(x) (x)
#define unlikely(x) (x)

namespace mos6581_8580 {
typedef unsigned int reg4;
typedef unsigned int reg8;
typedef unsigned int reg12;
typedef unsigned int reg16;
typedef unsigned int reg24;
typedef int cycle_count;
typedef short short_point[2];
typedef double double_point[2];
enum chip_model { MOS6581, MOS8580 };
enum sampling_method { SAMPLE_FAST, SAMPLE_INTERPOLATE, SAMPLE_RESAMPLE, SAMPLE_RESAMPLE_FASTMEM };
}

extern "C" { extern const char* mos6581_8580_version_string; }

#endif
