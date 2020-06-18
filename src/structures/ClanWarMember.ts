import ClanWarAttack from './ClanWarAttack';
import ClashAPI from '..';

export default class ClanWarMember {
	public attacks: ClanWarAttack[];
	public bestOpponentAttack: ClanWarAttack;
	public opponentAttacks: number;
	public rank: number;
	public tag: string;
	public townhall: number;
	public username: string;

	private api: ClashAPI;
	constructor(api: ClashAPI, data: { [key: string]: any }) {
		Object.defineProperty(this, 'api', { value: api });

		this.attacks = data.attacks.map(attack => new ClanWarAttack(this.api, attack));
		this.bestOpponentAttack = new ClanWarAttack(this.api, data.bestOpponentAttack);
		this.opponentAttacks = data.opponentAttacks;
		this.rank = data.mapPosition;
		this.tag = data.tag;
		this.townhall = data.townhallLevel;
		this.username = data.name;
	}
}