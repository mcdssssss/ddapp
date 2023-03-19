import { Provide } from '@midwayjs/decorator';
import { Repository } from 'typeorm';
import { BaseService } from './base.service';

@Provide()
export class QueryService extends BaseService {
  async select(
    entityManager: Repository<any>,
    {
      tables,
      wheres,
      current,
      pageSize,
      fields,
      order,
      group,
    }: {
      tables: string;
      wheres: string;
      fields?: string;
      order?: string;
      group?: string;
      current: number;
      pageSize: number;
    }
  ) {
    if (!fields) {
      fields = '*';
    }
    let sql = 'select ' + fields + ' from ' + tables;
    let countSql = 'select count(*) as total from ' + tables;
    let tj = '';
    if (wheres) {
      tj += ' where ' + wheres;
    }
    if (group) {
      tj += ' group by ' + group;
    }
    if (order) {
      tj += ' order by ' + order;
    }
    countSql += tj;
    if (current && pageSize) {
      tj += ' limit ' + (current - 1) * pageSize + ',' + pageSize;
    }
    sql += tj;
    const data = await entityManager.query(sql);
    const count = await entityManager.query(countSql);
    return {
      pageSize,
      current,
      count: parseInt(count && count.length > 0 ? count[0].total : 0),
      totalPages: data.length,
      data,
    };
  }

  async select2(
    entityManager: Repository<any>,
    {
      wheres,
      current,
      pageSize,
      order,
      group,
    }: {
      wheres: string;
      order?: 'DESC' | 'ASC';
      group?: string;
      current: number;
      pageSize: number;
    }
  ) {
    const query = entityManager.createQueryBuilder();
    query.where(wheres);

    if (group) {
      query.groupBy(group);
    }
    if (order) {
      query.orderBy('createTime', order);
    }

    query.skip((current - 1) * pageSize).take(pageSize);

    const data = await query.getManyAndCount();
    return {
      pageSize,
      current,
      count: data[1],
      data: data[0],
    };
  }
}
