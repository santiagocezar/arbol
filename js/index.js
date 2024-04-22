'use strict';


class Reglas {
    // P: Record<string, string[]>

    /**
     * @param {string} reglas
     */
    constructor(reglas) {
        this.P = {}
        const trimmed = reglas.split("\n").map(s => s.trim()).filter(s => s)
        for (const line of trimmed) {
            const [noTerminal, regla] = line.split("->", 2)
            const posibles = regla.split("|")
            this.P[noTerminal] = posibles
        }
    }

    /**
     * @param {string} cadena
     * @returns {[string, string, string][]}
     */
    noTerminales(cadena) {
        const encontrados = []
        for (const noTerminal in this.P) {
            for (const match of cadena.matchAll(noTerminal)) {
                encontrados.push([
                    noTerminal,
                    cadena.substring(0, match.index),
                    cadena.substring(match.index + noTerminal.length),
                ])
            }
        }

        return encontrados
    }

    /**
     * @param {string} cadena
     * @returns {string[]}
     */
    expandir(cadena) {
        const noTerminales = this.noTerminales(cadena)

        // es la sentencia final
        if (noTerminales.length == 0)
            return [cadena]

        const terminales = []

        for (const [noTerminal, izq, der] of noTerminales) {
            for (const reemplazo of this.P[noTerminal]) {
                terminales.push(
                    ...this.expandir(izq + reemplazo + der)
                )
            }
        }
        return terminales
    }


    /**
     * @param {string} cadena
     * @param {number} maxRecurse
     * @param {string[]} callStack
     */
    // arbol(cadena, maxRecurse = 5, callStack = []) {
    arbol(cadena, depth = 5) {
        const arbol = [cadena]

        depth -= 1
        for (const [noTerminal, izq, der] of this.noTerminales(cadena)) {
            if (depth == 0) {
                arbol.push(["..."])
                return arbol
            }
            for (const reemplazo of this.P[noTerminal]) {
                arbol.push(
                    this.arbol(izq + reemplazo + der, depth)
                )
            }
        }
        return arbol
    }
}

function renderTree(node) {
    const [label, ...children] = node

    const nodeEl = document.createElement("li")
    nodeEl.className = "node"
    const labelEl = document.createElement("span")
    labelEl.className = "label"

    labelEl.innerText = label
    nodeEl.appendChild(labelEl)

    if (children.length) {
        const childrenEl = document.createElement("ul")
        childrenEl.className = "children"

        for (const child of children) {
            childrenEl.appendChild(renderTree(child))
        }

        nodeEl.appendChild(childrenEl)
    } else {
        nodeEl.className += " empty"
    }


    return nodeEl
}

const treeRoot = document.getElementById("tree-root")
function generar(ev) {
    ev.preventDefault()

    const data = new FormData(ev.target)

    const a = new Reglas(data.get("rules"))
    treeRoot.textContent = ""
    treeRoot.appendChild(renderTree(
        a.arbol(data.get("start"), parseInt(data.get("max")))
    ))
}

const a = new Reglas(`
    A->Ba|Bu
    B->CDa|p
    C->Dp|u
    D->a
`)
treeRoot.textContent = ""
treeRoot.appendChild(renderTree(
    a.arbol("A")
))

document.getElementById("tree-form").addEventListener("submit", generar)

