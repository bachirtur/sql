// ============================================================
// SQL Engine - A simple SQL parser and executor for education
// ============================================================

export interface Row {
  [key: string]: string | number | null;
}

export interface Table {
  name: string;
  columns: string[];
  rows: Row[];
}

export interface Database {
  [tableName: string]: Table;
}

export interface QueryResult {
  success: boolean;
  columns: string[];
  rows: (string | number | null)[][];
  message?: string;
  error?: string;
  rowCount: number;
}

// ============================================================
// Default Database
// ============================================================

export function createDefaultDatabase(): Database {
  return {
    livres: {
      name: 'livres',
      columns: ['id', 'titre', 'annee', 'note', 'id_auteur'],
      rows: [
        { id: 1, titre: 'Les Misérables', annee: 1862, note: 18, id_auteur: 1 },
        { id: 2, titre: 'Le Petit Prince', annee: 1943, note: 17, id_auteur: 2 },
        { id: 3, titre: "L'Étranger", annee: 1942, note: 16, id_auteur: 3 },
        { id: 4, titre: 'Germinal', annee: 1885, note: 15, id_auteur: 4 },
        { id: 5, titre: "Harry Potter à l'école des sorciers", annee: 1997, note: 14, id_auteur: 5 },
        { id: 6, titre: '1984', annee: 1949, note: 19, id_auteur: 6 },
        { id: 7, titre: 'Notre-Dame de Paris', annee: 1831, note: 16, id_auteur: 1 },
        { id: 8, titre: 'Vol de Nuit', annee: 1931, note: 13, id_auteur: 2 },
      ],
    },
    auteurs: {
      name: 'auteurs',
      columns: ['id', 'nom', 'prenom', 'nationalite', 'annee_naissance'],
      rows: [
        { id: 1, nom: 'Hugo', prenom: 'Victor', nationalite: 'Français', annee_naissance: 1802 },
        { id: 2, nom: 'Saint-Exupéry', prenom: 'Antoine', nationalite: 'Français', annee_naissance: 1900 },
        { id: 3, nom: 'Camus', prenom: 'Albert', nationalite: 'Français', annee_naissance: 1913 },
        { id: 4, nom: 'Zola', prenom: 'Émile', nationalite: 'Français', annee_naissance: 1840 },
        { id: 5, nom: 'Rowling', prenom: 'J.K.', nationalite: 'Britannique', annee_naissance: 1965 },
        { id: 6, nom: 'Orwell', prenom: 'George', nationalite: 'Britannique', annee_naissance: 1903 },
      ],
    },
  };
}

// ============================================================
// SQL Parser
// ============================================================

interface ParsedColumn {
  expression: string; // column name or aggregate
  alias?: string;
  table?: string; // table prefix
  isAggregate?: boolean;
  aggregateFunc?: string;
  aggregateArg?: string;
}

interface ParsedCondition {
  left: string;
  leftTable?: string;
  operator: string;
  right: string;
  rightIsColumn?: boolean;
  rightTable?: string;
  connector?: 'AND' | 'OR'; // connector to next condition
}

interface ParsedJoin {
  table: string;
  leftCol: string;
  leftTable?: string;
  rightCol: string;
  rightTable?: string;
}

interface ParsedOrderBy {
  column: string;
  table?: string;
  direction: 'ASC' | 'DESC';
}

interface ParsedQuery {
  type: 'SELECT';
  columns: ParsedColumn[];
  selectAll: boolean;
  distinct: boolean;
  from: string;
  join?: ParsedJoin;
  where?: ParsedCondition[];
  orderBy?: ParsedOrderBy;
  limit?: number;
}

function tokenize(sql: string): string[] {
  const tokens: string[] = [];
  let i = 0;
  const s = sql.trim();

  while (i < s.length) {
    // Skip whitespace
    if (/\s/.test(s[i])) {
      i++;
      continue;
    }

    // String literal
    if (s[i] === "'") {
      let j = i + 1;
      while (j < s.length && s[j] !== "'") {
        if (s[j] === '\\') j++; // skip escaped chars
        j++;
      }
      tokens.push(s.substring(i, j + 1));
      i = j + 1;
      continue;
    }

    // Operators: >=, <=, !=, <>, =, >, <
    if (s[i] === '>' && s[i + 1] === '=') {
      tokens.push('>=');
      i += 2;
      continue;
    }
    if (s[i] === '<' && s[i + 1] === '=') {
      tokens.push('<=');
      i += 2;
      continue;
    }
    if (s[i] === '!' && s[i + 1] === '=') {
      tokens.push('!=');
      i += 2;
      continue;
    }
    if (s[i] === '<' && s[i + 1] === '>') {
      tokens.push('<>');
      i += 2;
      continue;
    }

    // Single-char operators
    if ('=><(),.*;'.includes(s[i])) {
      tokens.push(s[i]);
      i++;
      continue;
    }

    // Word (identifier or keyword)
    if (/[a-zA-Z_àâäéèêëïîôùûüÿçœæÀÂÄÉÈÊËÏÎÔÙÛÜŸÇŒÆ0-9]/.test(s[i])) {
      let j = i;
      while (j < s.length && /[a-zA-Z_àâäéèêëïîôùûüÿçœæÀÂÄÉÈÊËÏÎÔÙÛÜŸÇŒÆ0-9]/.test(s[j])) {
        j++;
      }
      tokens.push(s.substring(i, j));
      i = j;
      continue;
    }

    // Number
    if (/[0-9]/.test(s[i])) {
      let j = i;
      while (j < s.length && /[0-9.]/.test(s[j])) {
        j++;
      }
      tokens.push(s.substring(i, j));
      i = j;
      continue;
    }

    // Unknown char, skip
    i++;
  }

  return tokens;
}

function parseSQL(sql: string): ParsedQuery {
  const cleaned = sql.trim().replace(/;\s*$/, '');
  const tokens = tokenize(cleaned);

  if (tokens.length === 0) {
    throw new Error("Requête vide. Écrivez une requête SQL.");
  }

  const firstToken = tokens[0].toUpperCase();

  if (firstToken !== 'SELECT') {
    throw new Error(`Commande "${tokens[0]}" non supportée. Utilisez SELECT.`);
  }

  return parseSelect(tokens);
}

function parseSelect(tokens: string[]): ParsedQuery {
  let pos = 1; // skip SELECT
  const query: ParsedQuery = {
    type: 'SELECT',
    columns: [],
    selectAll: false,
    distinct: false,
    from: '',
  };

  // Check DISTINCT
  if (pos < tokens.length && tokens[pos].toUpperCase() === 'DISTINCT') {
    query.distinct = true;
    pos++;
  }

  // Parse columns until FROM
  const fromIndex = tokens.findIndex((t, i) => i >= pos && t.toUpperCase() === 'FROM');
  if (fromIndex === -1) {
    throw new Error("Mot-clé FROM manquant. Syntaxe : SELECT colonnes FROM table");
  }

  const columnTokens = tokens.slice(pos, fromIndex);
  if (columnTokens.length === 0) {
    throw new Error("Aucune colonne spécifiée après SELECT.");
  }

  // Parse column list
  if (columnTokens.length === 1 && columnTokens[0] === '*') {
    query.selectAll = true;
  } else {
    // Split by commas
    let currentCol: string[] = [];
    for (const token of columnTokens) {
      if (token === ',') {
        if (currentCol.length > 0) {
          query.columns.push(parseColumnExpression(currentCol));
          currentCol = [];
        }
      } else {
        currentCol.push(token);
      }
    }
    if (currentCol.length > 0) {
      query.columns.push(parseColumnExpression(currentCol));
    }
  }

  pos = fromIndex + 1;

  // Parse FROM table
  if (pos >= tokens.length) {
    throw new Error("Nom de table manquant après FROM.");
  }
  query.from = tokens[pos].toLowerCase();
  pos++;

  // Parse optional clauses: JOIN, WHERE, ORDER BY
  while (pos < tokens.length) {
    const keyword = tokens[pos].toUpperCase();

    if (keyword === 'JOIN' || keyword === 'INNER') {
      if (keyword === 'INNER') {
        pos++; // skip INNER
        if (pos >= tokens.length || tokens[pos].toUpperCase() !== 'JOIN') {
          throw new Error("Mot-clé JOIN attendu après INNER.");
        }
      }
      pos++; // skip JOIN

      if (pos >= tokens.length) {
        throw new Error("Nom de table manquant après JOIN.");
      }
      const joinTable = tokens[pos].toLowerCase();
      pos++;

      if (pos >= tokens.length || tokens[pos].toUpperCase() !== 'ON') {
        throw new Error("Mot-clé ON manquant après JOIN table. Syntaxe : JOIN table ON condition");
      }
      pos++; // skip ON

      // Parse ON condition: table1.col = table2.col
      const joinCondition = parseJoinCondition(tokens, pos);
      query.join = {
        table: joinTable,
        leftCol: joinCondition.leftCol,
        leftTable: joinCondition.leftTable,
        rightCol: joinCondition.rightCol,
        rightTable: joinCondition.rightTable,
      };
      pos = joinCondition.endPos;
    } else if (keyword === 'WHERE') {
      pos++;
      const whereResult = parseWhereClause(tokens, pos);
      query.where = whereResult.conditions;
      pos = whereResult.endPos;
    } else if (keyword === 'ORDER') {
      pos++;
      if (pos >= tokens.length || tokens[pos].toUpperCase() !== 'BY') {
        throw new Error("Mot-clé BY attendu après ORDER.");
      }
      pos++;

      if (pos >= tokens.length) {
        throw new Error("Colonne manquante après ORDER BY.");
      }

      let orderCol = tokens[pos];
      let orderTable: string | undefined;
      pos++;

      if (pos < tokens.length && tokens[pos] === '.') {
        pos++;
        orderTable = orderCol.toLowerCase();
        orderCol = tokens[pos];
        pos++;
      }

      let direction: 'ASC' | 'DESC' = 'ASC';
      if (pos < tokens.length) {
        const dir = tokens[pos].toUpperCase();
        if (dir === 'ASC' || dir === 'DESC') {
          direction = dir;
          pos++;
        }
      }

      query.orderBy = {
        column: orderCol.toLowerCase(),
        table: orderTable,
        direction,
      };
    } else if (keyword === 'LIMIT') {
      pos++;
      if (pos < tokens.length) {
        query.limit = parseInt(tokens[pos]);
        pos++;
      }
    } else {
      pos++; // skip unknown tokens
    }
  }

  return query;
}

function parseColumnExpression(tokens: string[]): ParsedColumn {
  // Handle COUNT(*), COUNT(col), etc.
  if (tokens.length >= 3 && tokens[0].toUpperCase() === 'COUNT' && tokens[1] === '(') {
    const closeParen = tokens.indexOf(')');
    if (closeParen === -1) {
      throw new Error("Parenthèse fermante manquante pour COUNT().");
    }
    const arg = tokens.slice(2, closeParen).join('');
    return {
      expression: `COUNT(${arg})`,
      isAggregate: true,
      aggregateFunc: 'COUNT',
      aggregateArg: arg,
    };
  }

  if (tokens.length >= 3 && ['SUM', 'AVG', 'MIN', 'MAX'].includes(tokens[0].toUpperCase()) && tokens[1] === '(') {
    const closeParen = tokens.indexOf(')');
    if (closeParen === -1) {
      throw new Error(`Parenthèse fermante manquante pour ${tokens[0]}().`);
    }
    const arg = tokens.slice(2, closeParen).join('');
    return {
      expression: `${tokens[0].toUpperCase()}(${arg})`,
      isAggregate: true,
      aggregateFunc: tokens[0].toUpperCase(),
      aggregateArg: arg,
    };
  }

  // Handle table.column
  if (tokens.length === 3 && tokens[1] === '.') {
    return {
      expression: tokens[2].toLowerCase(),
      table: tokens[0].toLowerCase(),
    };
  }

  // Handle AS alias
  if (tokens.length >= 3 && tokens[1].toUpperCase() === 'AS') {
    return {
      expression: tokens[0].toLowerCase(),
      alias: tokens[2],
    };
  }

  // Simple column name
  if (tokens.length === 1) {
    return {
      expression: tokens[0].toLowerCase(),
    };
  }

  return {
    expression: tokens.map(t => t.toLowerCase()).join(' '),
  };
}

function parseJoinCondition(tokens: string[], startPos: number) {
  let pos = startPos;

  // Expect: table1.col1 = table2.col2
  let leftTable: string | undefined;
  let leftCol: string;
  let rightTable: string | undefined;
  let rightCol: string;

  leftCol = tokens[pos];
  pos++;

  if (pos < tokens.length && tokens[pos] === '.') {
    pos++;
    leftTable = leftCol.toLowerCase();
    leftCol = tokens[pos];
    pos++;
  }

  // Skip =
  if (pos >= tokens.length || tokens[pos] !== '=') {
    throw new Error("Opérateur = attendu dans la condition ON.");
  }
  pos++;

  rightCol = tokens[pos];
  pos++;

  if (pos < tokens.length && tokens[pos] === '.') {
    pos++;
    rightTable = rightCol.toLowerCase();
    rightCol = tokens[pos];
    pos++;
  }

  return {
    leftCol: leftCol.toLowerCase(),
    leftTable,
    rightCol: rightCol.toLowerCase(),
    rightTable,
    endPos: pos,
  };
}

function parseWhereClause(tokens: string[], startPos: number) {
  const conditions: ParsedCondition[] = [];
  let pos = startPos;

  while (pos < tokens.length) {
    const keyword = tokens[pos].toUpperCase();
    if (['ORDER', 'GROUP', 'LIMIT', 'HAVING'].includes(keyword)) {
      break;
    }

    // Parse condition: left op right
    let left = tokens[pos];
    let leftTable: string | undefined;
    pos++;

    if (pos < tokens.length && tokens[pos] === '.') {
      pos++;
      leftTable = left.toLowerCase();
      left = tokens[pos];
      pos++;
    }

    if (pos >= tokens.length) {
      throw new Error("Condition WHERE incomplète.");
    }

    // Handle IS NULL / IS NOT NULL
    if (tokens[pos].toUpperCase() === 'IS') {
      pos++;
      let op = 'IS';
      if (pos < tokens.length && tokens[pos].toUpperCase() === 'NOT') {
        op = 'IS NOT';
        pos++;
      }
      if (pos < tokens.length && tokens[pos].toUpperCase() === 'NULL') {
        pos++;
      }
      conditions.push({
        left: left.toLowerCase(),
        leftTable,
        operator: op,
        right: 'NULL',
      });
    } else {
      const operator = tokens[pos];
      if (!['=', '!=', '<>', '>', '<', '>=', '<='].includes(operator) &&
          operator.toUpperCase() !== 'LIKE') {
        throw new Error(`Opérateur "${operator}" non reconnu dans WHERE.`);
      }
      pos++;

      if (pos >= tokens.length) {
        throw new Error("Valeur manquante dans la condition WHERE.");
      }

      let right = tokens[pos];
      let rightTable: string | undefined;
      let rightIsColumn = false;
      pos++;

      // Check if right side is table.column
      if (pos < tokens.length && tokens[pos] === '.') {
        pos++;
        rightTable = right.toLowerCase();
        right = tokens[pos];
        rightIsColumn = true;
        pos++;
      }

      conditions.push({
        left: left.toLowerCase(),
        leftTable,
        operator: operator.toUpperCase() === 'LIKE' ? 'LIKE' : operator,
        right,
        rightIsColumn,
        rightTable,
      });
    }

    // Check for AND/OR
    if (pos < tokens.length) {
      const connector = tokens[pos].toUpperCase();
      if (connector === 'AND' || connector === 'OR') {
        conditions[conditions.length - 1].connector = connector;
        pos++;
      }
    }
  }

  return { conditions, endPos: pos };
}

// ============================================================
// SQL Executor
// ============================================================

export function executeSQL(sql: string, db: Database): QueryResult {
  try {
    if (!sql || sql.trim().length === 0) {
      return {
        success: false,
        columns: [],
        rows: [],
        error: "⚠️ Veuillez entrer une requête SQL.",
        rowCount: 0,
      };
    }

    const query = parseSQL(sql);
    return executeQuery(query, db);
  } catch (e: any) {
    return {
      success: false,
      columns: [],
      rows: [],
      error: `❌ Erreur : ${e.message}`,
      rowCount: 0,
    };
  }
}

function executeQuery(query: ParsedQuery, db: Database): QueryResult {
  // Validate table exists
  const tableName = query.from;
  if (!db[tableName]) {
    const available = Object.keys(db).join(', ');
    throw new Error(`Table "${tableName}" introuvable. Tables disponibles : ${available}`);
  }

  let rows: Row[] = db[tableName].rows.map(r => ({ ...r }));
  let allColumns = [...db[tableName].columns];

  // Apply JOIN
  if (query.join) {
    const joinTableName = query.join.table;
    if (!db[joinTableName]) {
      const available = Object.keys(db).join(', ');
      throw new Error(`Table "${joinTableName}" introuvable pour JOIN. Tables disponibles : ${available}`);
    }

    const joinTable = db[joinTableName];
    const newRows: Row[] = [];

    for (const row of rows) {
      for (const joinRow of joinTable.rows) {
        // Resolve join condition
        const leftVal = resolveValue(row, query.join.leftCol, query.join.leftTable, tableName, db);
        const rightVal = resolveValue(joinRow, query.join.rightCol, query.join.rightTable, joinTableName, db);

        if (leftVal == rightVal) {
          // Merge rows
          const merged: Row = {};
          for (const col of db[tableName].columns) {
            merged[col] = row[col];
            merged[`${tableName}.${col}`] = row[col];
          }
          for (const col of joinTable.columns) {
            if (!(col in merged)) {
              merged[col] = joinRow[col];
            }
            merged[`${joinTableName}.${col}`] = joinRow[col];
          }
          newRows.push(merged);
        }
      }
    }

    rows = newRows;

    // Merge column lists (avoid duplicates)
    const joinCols = joinTable.columns.filter(c => !allColumns.includes(c));
    allColumns = [...allColumns, ...joinCols];
  }

  // Apply WHERE
  if (query.where && query.where.length > 0) {
    rows = rows.filter(row => evaluateWhere(row, query.where!, tableName, db));
  }

  // Handle aggregates
  const hasAggregate = query.columns.some(c => c.isAggregate);
  if (hasAggregate) {
    return executeAggregate(query, rows, allColumns);
  }

  // Apply ORDER BY
  if (query.orderBy) {
    const col = query.orderBy.column;
    const dir = query.orderBy.direction === 'DESC' ? -1 : 1;
    rows.sort((a, b) => {
      const aVal = resolveColumnValue(a, col, query.orderBy!.table);
      const bVal = resolveColumnValue(b, col, query.orderBy!.table);
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return (aVal - bVal) * dir;
      }
      return String(aVal).localeCompare(String(bVal)) * dir;
    });
  }

  // Apply DISTINCT
  if (query.distinct) {
    const seen = new Set<string>();
    rows = rows.filter(row => {
      const key = getSelectedValues(row, query, allColumns).join('||');
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  // Apply LIMIT
  if (query.limit !== undefined) {
    rows = rows.slice(0, query.limit);
  }

  // Select columns
  let resultColumns: string[];
  let resultRows: (string | number | null)[][];

  if (query.selectAll) {
    resultColumns = allColumns;
    resultRows = rows.map(row => allColumns.map(col => row[col] ?? null));
  } else {
    resultColumns = query.columns.map(c => c.alias || c.expression);
    resultRows = rows.map(row => {
      return query.columns.map(col => {
        if (col.table) {
          return row[`${col.table}.${col.expression}`] ?? row[col.expression] ?? null;
        }
        return row[col.expression] ?? null;
      });
    });
  }

  return {
    success: true,
    columns: resultColumns,
    rows: resultRows,
    message: `✅ ${resultRows.length} résultat(s) trouvé(s).`,
    rowCount: resultRows.length,
  };
}

function getSelectedValues(row: Row, query: ParsedQuery, allColumns: string[]): (string | number | null)[] {
  if (query.selectAll) {
    return allColumns.map(col => row[col] ?? null);
  }
  return query.columns.map(col => {
    if (col.table) {
      return row[`${col.table}.${col.expression}`] ?? row[col.expression] ?? null;
    }
    return row[col.expression] ?? null;
  });
}

function executeAggregate(query: ParsedQuery, rows: Row[], _allColumns: string[]): QueryResult {
  const resultColumns: string[] = [];
  const resultValues: (string | number | null)[] = [];

  for (const col of query.columns) {
    if (col.isAggregate) {
      resultColumns.push(col.expression);
      if (col.aggregateFunc === 'COUNT') {
        if (col.aggregateArg === '*') {
          resultValues.push(rows.length);
        } else {
          const colName = col.aggregateArg!.toLowerCase();
          resultValues.push(rows.filter(r => r[colName] != null).length);
        }
      } else if (col.aggregateFunc === 'SUM') {
        const colName = col.aggregateArg!.toLowerCase();
        const sum = rows.reduce((acc, r) => acc + (Number(r[colName]) || 0), 0);
        resultValues.push(sum);
      } else if (col.aggregateFunc === 'AVG') {
        const colName = col.aggregateArg!.toLowerCase();
        const values = rows.map(r => Number(r[colName])).filter(v => !isNaN(v));
        const avg = values.length > 0 ? Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 100) / 100 : 0;
        resultValues.push(avg);
      } else if (col.aggregateFunc === 'MIN') {
        const colName = col.aggregateArg!.toLowerCase();
        const values = rows.map(r => r[colName]).filter(v => v != null);
        resultValues.push(values.length > 0 ? Math.min(...values.map(Number)) : null);
      } else if (col.aggregateFunc === 'MAX') {
        const colName = col.aggregateArg!.toLowerCase();
        const values = rows.map(r => r[colName]).filter(v => v != null);
        resultValues.push(values.length > 0 ? Math.max(...values.map(Number)) : null);
      }
    } else {
      resultColumns.push(col.alias || col.expression);
      // For non-aggregate columns in aggregate query, take first row value
      if (rows.length > 0) {
        resultValues.push(rows[0][col.expression] ?? null);
      } else {
        resultValues.push(null);
      }
    }
  }

  return {
    success: true,
    columns: resultColumns,
    rows: [resultValues],
    message: `✅ 1 résultat trouvé.`,
    rowCount: 1,
  };
}

function resolveValue(row: Row, col: string, table: string | undefined, _defaultTable: string, _db: Database): string | number | null {
  if (table) {
    return row[`${table}.${col}`] ?? row[col] ?? null;
  }
  return row[col] ?? null;
}

function resolveColumnValue(row: Row, col: string, table?: string): string | number | null {
  if (table) {
    return row[`${table}.${col}`] ?? row[col] ?? null;
  }
  return row[col] ?? null;
}

function evaluateWhere(row: Row, conditions: ParsedCondition[], _tableName: string, _db: Database): boolean {
  let result = true;
  let pendingOr = false;

  for (let i = 0; i < conditions.length; i++) {
    const cond = conditions[i];
    const condResult = evaluateCondition(row, cond);

    if (i === 0) {
      result = condResult;
    } else {
      if (pendingOr) {
        result = result || condResult;
      } else {
        result = result && condResult;
      }
    }

    pendingOr = cond.connector === 'OR';
  }

  return result;
}

function evaluateCondition(row: Row, cond: ParsedCondition): boolean {
  // Get left value
  let leftVal: string | number | null;
  if (cond.leftTable) {
    leftVal = row[`${cond.leftTable}.${cond.left}`] ?? row[cond.left] ?? null;
  } else {
    leftVal = row[cond.left] ?? null;
  }

  // Handle IS NULL / IS NOT NULL
  if (cond.operator === 'IS') {
    return leftVal === null;
  }
  if (cond.operator === 'IS NOT') {
    return leftVal !== null;
  }

  // Get right value
  let rightVal: string | number | null;
  if (cond.rightIsColumn) {
    if (cond.rightTable) {
      rightVal = row[`${cond.rightTable}.${cond.right}`] ?? row[cond.right] ?? null;
    } else {
      rightVal = row[cond.right] ?? null;
    }
  } else {
    rightVal = parseValue(cond.right);
  }

  // Compare
  switch (cond.operator) {
    case '=':
      return leftVal == rightVal;
    case '!=':
    case '<>':
      return leftVal != rightVal;
    case '>':
      return Number(leftVal) > Number(rightVal);
    case '<':
      return Number(leftVal) < Number(rightVal);
    case '>=':
      return Number(leftVal) >= Number(rightVal);
    case '<=':
      return Number(leftVal) <= Number(rightVal);
    case 'LIKE':
      return matchLike(String(leftVal), String(rightVal));
    default:
      return false;
  }
}

function parseValue(val: string): string | number {
  // String literal
  if (val.startsWith("'") && val.endsWith("'")) {
    return val.slice(1, -1);
  }
  // Number
  const num = Number(val);
  if (!isNaN(num)) {
    return num;
  }
  return val;
}

function matchLike(value: string, pattern: string): boolean {
  // Remove quotes from pattern if present
  let p = pattern;
  if (p.startsWith("'") && p.endsWith("'")) {
    p = p.slice(1, -1);
  }
  // Convert SQL LIKE pattern to regex
  const regexStr = '^' + p.replace(/%/g, '.*').replace(/_/g, '.') + '$';
  return new RegExp(regexStr, 'i').test(value);
}

// ============================================================
// Helper: Get available tables info
// ============================================================

export function getDatabaseInfo(db: Database): string {
  return Object.values(db)
    .map(table => `${table.name} (${table.columns.join(', ')})`)
    .join('\n');
}
