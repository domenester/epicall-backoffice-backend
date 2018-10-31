export const messageTreeFormat = (messages: Array<any>) => {
  let tree: any = {};
  messages.forEach( (m: any) => {
    if (!tree[m.from]) { 
      tree[m.from] = {};
    }

    if (!tree[m.from][m.to]) {
      tree[m.from][m.to] = [];
    }

    if (!tree[m.to]) {
      tree[m.to] = {};
    };

    if (!tree[m.to][m.from]) {
      tree[m.to][m.from] = [];
    }

    tree[m.from][m.to].push(m);
    tree[m.to][m.from].push(m);
  });

  Object.keys(tree).forEach( k1 => {
    Object.keys(tree[k1]).forEach( k2 => {
      tree[k1][k2].sort( (a: any, b: any) => {
        a = new Date(a.createdAt);
        b = new Date(b.createdAt);
        return a>b ? 1 : a<b ? -1 : 0;
      })
    });
  });

  return tree;
}