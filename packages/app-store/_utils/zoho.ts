type ZohoServerInfo = {
  result: string;
  locations: Locations;
};

type Locations = {
  eu: string;
  au: string;
  in: string;
  jp: string;
  uk: string;
  us: string;
  ca: string;
  sa: string;
};

/**
 * Get the Zoho server info
 * @returns ZohoServerInfo
 * See documentation reference below
 * https://www.zoho.com/accounts/protocol/oauth/multi-dc/client-authorization.html
 */

export async function getZohoServerInfo() {
  const response = await fetch("https://accounts.zoho.com/oauth/serverinfo");
  const responseBody: ZohoServerInfo = await response.json();
  return responseBody;
}

/**
 * Check if the accounts server URL is authorized
 * @param accountsServer
 * See documentation reference below
 * https://www.zoho.com/crm/developer/docs/api/v6/multi-dc.html#:~:text=US:%20https://accounts.zoho,https://accounts.zohocloud.ca&text=The%20%22location=us%22%20parameter,domain%20in%20all%20API%20endpoints.&text=You%20must%20make%20the%20authorization,.zoho.com.cn.
 */
export async function isAuthorizedAccountsServerUrl(accountsServer: string) {
  const zohoServerInfo = await getZohoServerInfo();
  const authorizedAccountServers = Object.values(zohoServerInfo.locations);
  return authorizedAccountServers.includes(accountsServer);
}

/**
 * Get the valid location
 * @param location
 */
export async function getValidLocation(location: string) {
  const zohoServerInfo = await getZohoServerInfo();
  const accountsServer = zohoServerInfo.locations[location as keyof Locations];

  if (!accountsServer) {
    throw new Error(`Invalid location: ${location}`);
  }

  return accountsServer.replace(/https:\/\/accounts\.(zoho\.|zohocloud\.)/, "");
}
