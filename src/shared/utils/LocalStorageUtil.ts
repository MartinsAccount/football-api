export class LocalStorageUtil {
	public static OneSeconds = 1000;
	public static OneMinute = LocalStorageUtil.OneSeconds * 60;
	public static OneHour = LocalStorageUtil.OneMinute * 60;
	public static OneDay = LocalStorageUtil.OneHour * 24;
	public static OneYear = LocalStorageUtil.OneDay * 365;

	public static GetKey(key: string) {
		return `${'ls'}_${key}`;
	}

	public static GetExpiresKey(key: string) {
		return `${LocalStorageUtil.GetKey(key)}_EXP`;
	}

	public static IsExpired(key: string) {
		const nowInMs = new Date().getTime();
		const expiresInCache = localStorage.getItem(LocalStorageUtil.GetExpiresKey(key));

		if (expiresInCache) {
			if (+expiresInCache >= nowInMs) {
				return false;
			}
		}

		return true;
	}

	public static Set(key: string, data: any, expires: number = this.OneHour) {
		const nowInMs = new Date().getTime();
		const expiresInMs = nowInMs + expires;

		localStorage.setItem(LocalStorageUtil.GetKey(key), JSON.stringify(data));
		localStorage.setItem(LocalStorageUtil.GetExpiresKey(key), String(expiresInMs));
	}

	public static Get(key: string) {
		const data = localStorage.getItem(LocalStorageUtil.GetKey(key));

		if (data && LocalStorageUtil.IsExpired(key) === false) {
			return JSON.parse(data);
		}

		return null;
	}

	public static Remove(key: string) {
		localStorage.removeItem(LocalStorageUtil.GetKey(key));
		localStorage.removeItem(LocalStorageUtil.GetExpiresKey(key));
	}
}
