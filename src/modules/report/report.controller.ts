import {
  Controller,
  Get,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ReportStatus } from 'src/enums/report-status.enum';
import { ReportService } from './report.service';

@Controller('reports')
export class ReportController {
  constructor(private reportService: ReportService) {}

  @UseGuards(JwtAuthGuard)
  @Get('getPendingReports')
  public getPendingReports() {
    return this.reportService.getPendingReports();
  }

  @UseGuards(JwtAuthGuard)
  @Post('createReport/:articleID/:userID')
  public createReport(
    @Param('articleID', ParseIntPipe) articleID: number,
    @Param('userID', ParseIntPipe) userID: number,
  ) {
    return this.reportService.createReport(articleID, userID);
  }

  @UseGuards(JwtAuthGuard)
  @Put('updateReport/:id/:status')
  public updateReport(
    @Param('id', ParseIntPipe) id: number,
    @Param('status', new ParseEnumPipe(ReportStatus)) status: ReportStatus,
  ) {
    return this.reportService.updateReport(id, status);
  }

  @Get('all')
  public getAll() {
    return this.reportService.getAll();
  }
}
