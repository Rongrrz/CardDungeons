export class Queue<T extends defined> {
	private queueIn = new Array<T>();
	private queueOut = new Array<T>();

	public add(x: T): void {
		this.queueIn.push(x);
	}

	public pop(): T | undefined {
		if (this.queueOut.size() === 0) {
			while (this.queueIn.size() !== 0) {
				this.queueOut.push(this.queueIn.pop()!);
			}
		}
		return this.queueOut.pop();
	}

	public peek(): T | undefined {
		if (this.queueOut.size() === 0) {
			return this.queueIn.size() === 0 ? undefined : this.queueIn[0];
		}
		return this.queueOut[this.queueOut.size() - 1];
	}

	public clear(): void {
		this.queueIn.clear();
		this.queueOut.clear();
	}

	public size(): number {
		return this.queueIn.size() + this.queueOut.size();
	}
}
