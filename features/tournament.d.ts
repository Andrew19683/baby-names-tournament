import type { Gender, GenderPlural, Name, Match, Matches } from "./types.js";
export declare function startTournament(names: Name[], gender: Gender): Name[];
export declare function generateMatches(names: Name[], gender: GenderPlural): Match[];
export declare function findMatchById(matches: Matches, gender: GenderPlural, id: number): Match;
export declare function resolveMatch(matches: Matches, matchId: number, gender: GenderPlural, winnerId: number, loserId: number): Matches | undefined;
export declare function playByeMatches(matches: Matches): void;
//# sourceMappingURL=tournament.d.ts.map