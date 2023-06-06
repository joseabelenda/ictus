/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

import React, { useEffect, useState } from 'react';

import ClayTable from '@clayui/table';
import ClayLayout from '@clayui/layout';
import ClayBadge from '@clayui/badge';
import ClayLabel from '@clayui/label';

function MemberList() {

  const [data, setData] = useState([]);

  const BASE_URL = 'http://localhost:8080'

  const baseFetch = async (url, options = {}) => {
    return fetch(BASE_URL + '/' + url, {
      headers: {
        'Content-Type': 'application/json',
        'x-csrf-token': Liferay.authToken,
      },
      ...options,
    });
  };

  useEffect(
    () => {
      getData();
    }, []
  );

  const getData = () => {
    baseFetch('o/c/members/?nestedFields=r_personToMember')
      .then((response) => response.json())
      .then((json) => {
        console.log('Done');
        console.log('JSON', json);
        console.log('Items', json.items);
        setData(json.items);
      })
      .catch((error) => {
        console.log('ICTUS error', error);
      });
  }

  function getMemberTypeDisplayType(string) {
    if (string === 'communicant') {
      return 'info'
    }
    else if (string === 'notCommunicant') {
      return 'warning'
    }
  }

  function getMemberStatusDisplayType(string) {
    if (string === 'communion') {
      return 'success'
    }
    else if (string === 'inactive') {
      return 'secondary'
    }
  }

  return (
    <ClayLayout.ContainerFluid>
      <ClayTable>
        <ClayTable.Head>
          <ClayTable.Row>
            <ClayTable.Cell className='table-cell-minw-200' headingCell>{"Nome"}</ClayTable.Cell>
            <ClayTable.Cell className='table-cell-minw-50' headingCell>{"E-mail"}</ClayTable.Cell>
            <ClayTable.Cell headingCell>{"Tipo"}</ClayTable.Cell>
            <ClayTable.Cell headingCell>{"Situação"}</ClayTable.Cell>
          </ClayTable.Row>
        </ClayTable.Head>
        <ClayTable.Body>
          {
            data.map((item) => {
              var i = 0;
              console.log('ITEM', item);
              return (
                <ClayTable.Row id={i++}>
                  <ClayTable.Cell headingTitle>
                    <div>
                      <img src={BASE_URL + item.r_personToMember_c_person?.photo?.link?.href} style={{ 'border-radius': '50%', 'maxHeight': 35, marginRight: 10 }} />
                      {item.r_personToMember_c_person.name}
                    </div>
                  </ClayTable.Cell>
                  <ClayTable.Cell>{item.r_personToMember_c_person.emailAddress}</ClayTable.Cell>
                  <ClayTable.Cell>
                    <ClayLabel displayType={getMemberTypeDisplayType(item.memberType.key)}>
                      {item.memberType.name}
                    </ClayLabel>
                  </ClayTable.Cell>
                  <ClayTable.Cell>
                    <ClayLabel displayType={getMemberStatusDisplayType(item.memberStatus.key)}>
                      {item.memberStatus.name}
                    </ClayLabel>
                  </ClayTable.Cell>
                </ClayTable.Row>
              )
            }
            )
          }
        </ClayTable.Body>
      </ClayTable>
    </ClayLayout.ContainerFluid>
  );
}

export default MemberList;
