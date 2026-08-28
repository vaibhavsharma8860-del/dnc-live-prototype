/* Keep RLC directory country-level. Restored expert and engagement context lives in Add and Record Detail. */
const v18DecorateTablesOriginal=v16DecorateTables;
v16DecorateTables=function(){if(state.view==='rlc')return;return v18DecorateTablesOriginal();};
