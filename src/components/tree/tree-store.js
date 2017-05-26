// console.log("44444***");
// const pinyin = require('chinese-to-pinyin')
// export default class TreeStore {
//     constructor(options) {
//         for (let option in options) {
//             if (options.hasOwnProperty(option)) {
//                 this[option] = options[option]
//             }
//         }
//         this.datas = new Map()
//         const _traverseNodes = (root) => {
//             for (let node of root) {
//                 this.datas.set(node.id, node)
//                 if (node.children && node.children.length > 0) _traverseNodes(node.children)
//             }
//         }
//         _traverseNodes(this.root)
//     }
//     initNodes(root) {
//         this.datas = new Map()
//         const _traverseNodes = (root) => {
//             for (let node of root) {
//                 this.datas.set(node.id, node)
//                 if (node.children && node.children.length > 0) _traverseNodes(node.children)
//             }
//         }
//         _traverseNodes(root)
//     }
//     changeCheckStatus(node) {
//         const _traverseUp = (node) => {
//             if (node.checked && node.parentId) {
//                 let parent = this.getNode(node.parentId)
//                 parent.checked = this.sameSilibingChecked(node.parentId, node.id)
//                 _traverseUp(parent)
//             } else {
//                 if (!node.checked && node.parentId) {
//                     let upparent = this.getNode(node.parentId)
//                     upparent.checked = false
//                     if (upparent.parentId) {
//                         _traverseUp(upparent)
//                     }
//                 }
//             }
//         }

//         const _traverseDown = (node) => {
//             if (node.children && node.children.length > 0) {
//                 for (let child of node.children) {
//                     child.checked = node.checked
//                     _traverseDown(child)
//                 }
//             }
//         }
//         _traverseUp(node)
//         _traverseDown(node)
//     }
//     isNullOrEmpty(world) {
//         if (world) {
//             return world.trim().length === 0
//         }
//         return true
//     }
//     filterNodes(keyworld, searchOptions) {
//         const _filterNode = (val, node) => {
//             if (!val) return true
//             if (searchOptions.useEnglish) {
//                 return node.label.indexOf(val) !== -1
//             } else {
//                 return this.toPinYin(node.label, searchOptions.useInitial).indexOf(this.toPinYin(keyworld.toLowerCase(), searchOptions.useInitial, true)) !== -1
//             }
//         }

//         const _syncNodeStatus = (node) => {
//             if (node.parentId) {
//                 let parentNode = this.getNode(node.parentId)
//                 if (node.visible) {
//                     parentNode.visible = node.visible
//                     _syncNodeStatus(parentNode)
//                 }
//             }
//         }
//         let filterFunc = (searchOptions.customFilter && typeof(searchOptions.customFilter) === 'function') ? searchOptions.customFilter : _filterNode
//         this.datas.forEach(node => {
//             node.visible = filterFunc(keyworld, node)
//             node.searched = false
//             if (node.visible) {
//                 if (!this.isNullOrEmpty(keyworld)) {
//                     node.searched = true
//                 }
//                 _syncNodeStatus(node)
//             }
//         })
//     }
//     getNode(key) {
//         return this.datas.get(key)
//     }
//     sameSilibingChecked(parentId, currentId) {
//         let parent = this.datas.get(parentId)
//         let sbIds = []
//         parent.children.forEach(x => {
//             if (x.id !== currentId) sbIds.push(x.id)
//         })
//         for (let id of sbIds) {
//             let node = this.getNode(id)
//             if (!node.checked) return false
//         }
//         return true
//     }
//     toPinYin(keyworld, useInitial) {
//         if (/^[a-zA-Z]/.test(keyworld)) {
//             return keyworld
//         }
//         let fullpinyin = pinyin(keyworld, {
//             filterChinese: true,
//             noTone: true
//         })
//         if (useInitial) {
//             let res = ''
//             fullpinyin.split(' ').forEach(w => {
//                 if (!(/[a-zA-Z]/.test(w))) {
//                     res += w
//                 } else {
//                     res += w.slice(0, 1)
//                 }
//             })
//             return res
//         }
//         return fullpinyin
//     }
// }


const pinyin = require('chinese-to-pinyin')
export default class TreeStore {

    constructor(options) {
        for (let option in options) {
            if (options.hasOwnProperty(option)) {
                this[option] = options[option]
            }
        }
        this.datas = new Map()
        const _traverseNodes = (root) => {
            for (let node of root) {
                this.datas.set(node.id, node)
                if (node.children && node.children.length > 0) _traverseNodes(node.children)
            }
        }
        _traverseNodes(this.root)
    }
    changeCheckHalfStatus(node) {
        const _traverseUp = (node) => {
            if (node.checked && node.parentId) {
                let parent = this.getNode(node.parentId)
                parent.checked = this.sameSilibingHalfChecked(node.parentId, node.id)
                _traverseUp(parent)
            } else {
                if (!node.checked && node.parentId) {
                    let upparent = this.getNode(node.parentId)
                    upparent.checked = false
                    if (upparent.parentId) {
                        _traverseUp(upparent)
                    }
                }
            }
        }

        const _traverseDown = (node) => {
            if (node.children && node.children.length > 0) {
                for (let child of node.children) {
                    child.checked = node.checked
                    _traverseDown(child)
                }
            }
        }
        _traverseUp(node)
        _traverseDown(node)
    }
    changeCheckStatus(node) {
        let flag = false;
        //如果勾选的是子节点，父节点默认打上勾
        const _traverseUp = (node, flag) => {
            let parent = null;
            if (node.checked) { //打钩
                if (node.parentId) {
                    parent = this.getNode(node.parentId)
                    if (flag) {
                        parent.checked = true
                        parent.nodeSelectNotAll = true
                        _traverseUp(parent, true)
                    } else {
                        parent.checked = true;
                        parent.nodeSelectNotAll = this.sameSilibingChecked(true, parent, node.parentId, node.id) === 'half' ? true : false; //返回true则全钩，false为半钩

                        _traverseUp(parent)
                    }
                }
            } else { //去钩
                if (node.parentId) {
                    parent = this.getNode(node.parentId)
                    if (this.sameSilibingChecked(false, parent, node.parentId, node.id) === "none") { //返回true则全没钩，false为半钩
                        parent.checked = false
                        parent.nodeSelectNotAll = false
                    } else {
                        parent.checked = true
                        parent.nodeSelectNotAll = true
                    }
                    _traverseUp(parent, true)
                }
            }
        }

        const _traverseDown = (node) => {
            if (node.children && node.children.length > 0) {
                if (node.nodeSelectNotAll) { //节点没勾选
                    node.nodeSelectNotAll = false
                }

                for (let child of node.children) {
                    child.checked = node.checked
                    _traverseDown(child)
                }
            }
        }

        _traverseUp(node)
        _traverseDown(node)
    }
    initNodes(root) {
        this.datas = new Map()
        const _traverseNodes = (root) => {
            for (let node of root) {
                this.datas.set(node.id, node)
                if (node.children && node.children.length > 0) _traverseNodes(node.children)
            }
        }
        _traverseNodes(root)
    }
    initParentStatus(id, pNodesId) {
        //如果勾选的是子节点，父节点默认打上勾
        const _traverseUp = (id) => { //打钩
            let node = this.getNode(id)
            if (node) {
                let parentId = node.parentId

                let parent = null
                if (pNodesId.indexOf(parentId) > -1) {
                    return
                }
                if (parentId) {
                    parent = this.getNode(parentId)
                    parent.checked = true //返回true则全钩，false为半钩
                    parent.nodeSelectNotAll = this.sameSilibingChecked(true, parent, node.parentId, node.id) === 'half' ? true : false //返回true则全钩，false为半钩

                    pNodesId.push(parentId);

                    _traverseUp(parentId)
                }
            }
        }

        _traverseUp(id)
    }
    sameSilibingHalfChecked(parentId, currentId) {
        let parent = this.datas.get(parentId)
        let sbIds = []
        parent.children.forEach(x => {
            if (x.id !== currentId) sbIds.push(x.id)
        })
        for (let id of sbIds) {
            let node = this.getNode(id)
            if (!node.checked) return false
        }
        return true
    }
    sameSilibingChecked(status, parent, parentId, currentId) {
        let sbIds = []
        parent.children.forEach(x => {
            if (x.id !== currentId) sbIds.push(x.id) //除去当前节点的剩下节点
        })

        if (status) { //打钩
            if (sbIds.length !== 0) {
                for (let id of sbIds) { //子节点只要有一个被选中则父框打黑，全选打钩，全没有被选无状态
                    let node = this.getNode(id)
                    if (!node.checked || node.nodeSelectNotAll) { //节点没勾选
                        return "half" //表示父框半钩的状态
                    }
                }
            } else {
                let currentNode = this.getNode(currentId)
                if (currentNode.nodeSelectNotAll) {
                    return "half" //表示全钩的状态
                }
            }
            return "all" //表示全钩的状态
        } else { //去钩
            if (sbIds.length !== 0) {
                for (let id of sbIds) { //子节点只要有一个被选中则父框打黑，全选打钩，全没有被选无状态
                    let node = this.getNode(id)
                    if (node.checked || node.nodeSelectNotAll) { //有节点被勾选，父框半钩的状态
                        return "half"
                    }
                }
            } else {
                let currentNode = this.getNode(currentId)
                if (currentNode.nodeSelectNotAll) {
                    return "half" //表示全钩的状态
                }
            }
            return "none"
        }
    }
    isExitParent(parent) {
        if (parent.id) {
            return this.getNode(node.parentId)
        }
        return null
    }
    isNullOrEmpty(world) {
        if (world) {
            return world.trim().length === 0
        }
        return true
    }
    filterNodes(keyworld, searchOptions) {
        const _filterNode = (val, node) => {
            if (!val) return true
            if (searchOptions.useEnglish) {
                return node.label.indexOf(val) !== -1
            } else {
                return this.toPinYin(node.label, searchOptions.useInitial).indexOf(this.toPinYin(keyworld.toLowerCase(), searchOptions.useInitial, true)) !== -1
            }
        }

        const _syncNodeStatus = (node) => {
            if (node.parentId) {
                let parentNode = this.getNode(node.parentId)
                if (node.visible) {
                    parentNode.visible = node.visible
                    _syncNodeStatus(parentNode)
                }
            }
        }
        let filterFunc = (searchOptions.customFilter && typeof(searchOptions.customFilter) === 'function') ? searchOptions.customFilter : _filterNode
        this.datas.forEach(node => {
            node.visible = filterFunc(keyworld, node)
            node.searched = false
            if (node.visible) {
                if (!this.isNullOrEmpty(keyworld)) {
                    node.searched = true
                }
                _syncNodeStatus(node)
            }
        })
    }
    getNode(key) {
        return this.datas.get(key)
    }
    toPinYin(keyworld, useInitial) {
        if (/^[a-zA-Z]/.test(keyworld)) {
            return keyworld
        }
        let fullpinyin = pinyin(keyworld, {
            filterChinese: true,
            noTone: true
        })
        if (useInitial) {
            let res = ''
            fullpinyin.split(' ').forEach(w => {
                if (!(/[a-zA-Z]/.test(w))) {
                    res += w
                } else {
                    res += w.slice(0, 1)
                }
            })
            return res
        }
        return fullpinyin
    }
}