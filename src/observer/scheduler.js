import { nextTick } from '../util/next-tick'


let hash = {}

let queue = []


function flushSchedulerQueue() {
    for (let i = 0; i < queue.length; i++) {
        let watcher = queue[i]
        watcher.run()
    }
    hash = {}
    queue = []
}

let pending = false

export function queuWatcher(watcher) {
    const id = watcher.id
    if (!hash[id]) {
        /**
         * 因为异步的原因
         * 我们可以在这个时刻拿到多个相同watcher
         * 多个相同watcher合并成一个
         * 做到批量更新
         */
        hash[id] = true
        queue.push(watcher)
        if (!pending) {
            nextTick(flushSchedulerQueue)
            pending = true
        }
    }
}