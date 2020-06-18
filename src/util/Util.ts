import { IconURLOptions } from './Interfaces';

export default class Util {
	static iconURL(size: IconURLOptions, object: {
		tiny: string;
		small: string;
		medium: string;
	}) {
		return object[size];
	}
}