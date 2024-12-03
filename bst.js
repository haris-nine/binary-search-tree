class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

class Tree {
  constructor(array) {
    const uniqueSortedArray = [...new Set(array)].sort((a, b) => a - b);
    this.root = this.buildTree(uniqueSortedArray);
  }

  buildTree(array) {
    if (array.length === 0) return null;

    const midIndex = Math.floor(array.length / 2);
    const rootNode = new Node(array[midIndex]);

    rootNode.left = this.buildTree(array.slice(0, midIndex));
    rootNode.right = this.buildTree(array.slice(midIndex + 1));

    return rootNode;
  }

  insert(value) {
    const newNode = new Node(value);

    if (this.root === null) {
      this.root = newNode;
      return;
    }

    let current = this.root;
    while (true) {
      if (value === current.data) return;

      if (value < current.data) {
        if (current.left === null) {
          current.left = newNode;
          return;
        }
        current = current.left;
      } else {
        if (current.right === null) {
          current.right = newNode;
          return;
        }
        current = current.right;
      }
    }
  }

  findMinNode(node) {
    let current = node;
    while (current.left !== null) {
      current = current.left;
    }
    return current;
  }

  deleteItem(value) {
    this.root = this.deleteNode(this.root, value);
  }

  deleteNode(node, value) {
    if (node === null) return null;

    if (value < node.data) {
      node.left = this.deleteNode(node.left, value);
      return node;
    } else if (value > node.data) {
      node.right = this.deleteNode(node.right, value);
      return node;
    }

    if (node.left === null && node.right === null) {
      return null;
    }

    if (node.left === null) return node.right;
    if (node.right === null) return node.left;

    const minNode = this.findMinNode(node.right);
    node.data = minNode.data;
    node.right = this.deleteNode(node.right, minNode.data);
    return node;
  }

  find(value) {
    let current = this.root;
    while (current !== null) {
      if (value === current.data) return current;
      current = value < current.data ? current.left : current.right;
    }
    return null;
  }

  levelOrder(callback) {
    if (!callback) throw new Error('Callback is required');
    
    if (this.root === null) return;

    const queue = [this.root];
    while (queue.length > 0) {
      const node = queue.shift();
      callback(node);

      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
  }

  inOrder(callback) {
    if (!callback) throw new Error('Callback is required');

    const traverse = (node) => {
      if (node === null) return;
      
      traverse(node.left);
      callback(node);
      traverse(node.right);
    };

    traverse(this.root);
  }

  preOrder(callback) {
    if (!callback) throw new Error('Callback is required');

    const traverse = (node) => {
      if (node === null) return;
      
      callback(node);
      traverse(node.left);
      traverse(node.right);
    };

    traverse(this.root);
  }

  postOrder(callback) {
    if (!callback) throw new Error('Callback is required');

    const traverse = (node) => {
      if (node === null) return;
      
      traverse(node.left);
      traverse(node.right);
      callback(node);
    };

    traverse(this.root);
  }

  height(node) {
    if (node === null) return -1;

    const leftHeight = this.height(node.left);
    const rightHeight = this.height(node.right);

    return Math.max(leftHeight, rightHeight) + 1;
  }

  depth(node) {
    if (node === null) return -1;

    let current = this.root;
    let depth = 0;

    while (current !== null) {
      if (node.data === current.data) return depth;
      
      current = node.data < current.data ? current.left : current.right;
      depth++;
    }

    return -1; 
  }

  isBalanced() {
    const checkBalance = (node) => {
      if (node === null) return true;

      const leftHeight = this.height(node.left);
      const rightHeight = this.height(node.right);

      if (Math.abs(leftHeight - rightHeight) > 1) return false;

      return checkBalance(node.left) && checkBalance(node.right);
    };

    return checkBalance(this.root);
  }

  rebalance() {
    const values = [];
    
    this.inOrder(node => values.push(node.data));

    this.root = this.buildTree(values);
  }
}

const prettyPrint = (node, prefix = "", isLeft = true) => {
  if (node === null) {
    return;
  }
  if (node.right !== null) {
    prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
  }
  console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
  if (node.left !== null) {
    prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
  }
};

function runBinarySearchTreeDemo() {
  function generateRandomArray(size = 15, max = 100) {
    return Array.from({length: size}, () => Math.floor(Math.random() * max));
  }

  console.log("Creating a balanced binary search tree...");
  const randomArray = generateRandomArray();
  const bst = new Tree(randomArray);

  console.log("\nConfirming tree is balanced:");
  console.log("Is Balanced:", bst.isBalanced());

  console.log("\nPrinting traversals:");
  console.log("Level Order:");
  bst.levelOrder(node => process.stdout.write(`${node.data} `));
  console.log("\n\nPre-order:");
  bst.preOrder(node => process.stdout.write(`${node.data} `));
  console.log("\n\nIn-order:");
  bst.inOrder(node => process.stdout.write(`${node.data} `));
  console.log("\n\nPost-order:");
  bst.postOrder(node => process.stdout.write(`${node.data} `));

  console.log("\n\nUnbalancing the tree by adding large numbers...");
  [101, 102, 103, 104, 105].forEach(num => bst.insert(num));

  console.log("\nConfirming tree is unbalanced:");
  console.log("Is Balanced:", bst.isBalanced());

  console.log("\nRebalancing the tree...");
  bst.rebalance();

  console.log("\nConfirming tree is balanced after rebalancing:");
  console.log("Is Balanced:", bst.isBalanced());

  console.log("\nPrinting traversals after rebalancing:");
  console.log("Level Order:");
  bst.levelOrder(node => process.stdout.write(`${node.data} `));
  console.log("\n\nPre-order:");
  bst.preOrder(node => process.stdout.write(`${node.data} `));
  console.log("\n\nIn-order:");
  bst.inOrder(node => process.stdout.write(`${node.data} `));
  console.log("\n\nPost-order:");
  bst.postOrder(node => process.stdout.write(`${node.data} `));
}

runBinarySearchTreeDemo();

