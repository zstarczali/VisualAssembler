* = $1000
#define A
#if A && !B
 lda #1
#elif B
 lda #2
#else
 lda #3
#endif
#undef A
#if A
 lda #4
#else
 lda #5
#endif
